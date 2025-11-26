/**
 * 搜尋索引同步 Worker
 * 監聽 Listing 變更事件並同步到搜尋引擎
 */
import { EventEmitter } from 'events';
import prisma from '../../lib/prisma';
import { meilisearchService } from './meilisearch.service';
import { ListingDocument, SyncEvent, SyncEventType } from './search.types';

// ==================== 事件發射器 ====================

export const syncEventEmitter = new EventEmitter();
syncEventEmitter.setMaxListeners(100);

// ==================== 同步佇列 ====================

interface QueueItem {
  event: SyncEvent;
  retries: number;
}

class SyncQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private readonly maxRetries = 3;
  private readonly batchSize = 50;
  private readonly processInterval = 1000; // 1 秒

  constructor() {
    this.startProcessing();
  }

  /**
   * 加入佇列
   */
  enqueue(event: SyncEvent): void {
    this.queue.push({ event, retries: 0 });
  }

  /**
   * 開始處理佇列
   */
  private startProcessing(): void {
    setInterval(() => this.processQueue(), this.processInterval);
  }

  /**
   * 處理佇列
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    try {
      // 取出一批事件
      const batch = this.queue.splice(0, this.batchSize);

      // 按類型分組
      const creates: string[] = [];
      const updates: string[] = [];
      const deletes: string[] = [];

      for (const item of batch) {
        switch (item.event.type) {
          case 'create':
            creates.push(item.event.listingId);
            break;
          case 'update':
            updates.push(item.event.listingId);
            break;
          case 'delete':
            deletes.push(item.event.listingId);
            break;
        }
      }

      // 處理建立和更新（合併處理）
      const toIndex = [...new Set([...creates, ...updates])];
      if (toIndex.length > 0) {
        await this.indexListings(toIndex);
      }

      // 處理刪除
      if (deletes.length > 0) {
        await meilisearchService.deleteDocuments(deletes);
      }
    } catch (error) {
      console.error('同步佇列處理錯誤:', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * 索引房源
   */
  private async indexListings(ids: string[]): Promise<void> {
    const listings = await prisma.listing.findMany({
      where: { id: { in: ids } },
      include: {
        images: {
          where: { isCover: true },
          take: 1,
        },
        user: {
          select: { id: true, name: true },
        },
      },
    });

    const documents: ListingDocument[] = listings.map(listing => {
      const amenities: string[] =
        typeof listing.amenities === 'string'
          ? (JSON.parse(listing.amenities) as string[])
          : (listing.amenities || []);

      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: listing.currency,
        propertyType: listing.propertyType,
        beds: listing.beds,
        baths: listing.baths,
        area: listing.area ? Number(listing.area) : null,
        address: listing.address,
        city: listing.city,
        district: listing.district,
        _geo:
          listing.latitude && listing.longitude
            ? { lat: Number(listing.latitude), lng: Number(listing.longitude) }
            : null,
        amenities,
        status: listing.status,
        coverImage: listing.images[0]?.url || null,
        viewCount: listing.viewCount,
        userId: listing.userId,
        userName: listing.user.name,
        createdAt: listing.createdAt.getTime(),
        updatedAt: listing.updatedAt.getTime(),
      };
    });

    await meilisearchService.indexDocuments(documents);
  }
}

// ==================== 同步 Worker ====================

class SyncWorker {
  private queue: SyncQueue;
  private initialized = false;

  constructor() {
    this.queue = new SyncQueue();
    this.setupEventListeners();
  }

  /**
   * 初始化 Worker
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 初始化 Meilisearch 索引
      await meilisearchService.initializeIndex();
      this.initialized = true;
      console.log('✅ 搜尋同步 Worker 已啟動');
    } catch (error) {
      console.error('❌ 搜尋同步 Worker 啟動失敗:', error);
    }
  }

  /**
   * 設定事件監聽器
   */
  private setupEventListeners(): void {
    // 監聽 listing 建立事件
    syncEventEmitter.on('listing:created', (listingId: string) => {
      this.queue.enqueue({
        type: 'create',
        listingId,
        timestamp: new Date(),
      });
    });

    // 監聽 listing 更新事件
    syncEventEmitter.on('listing:updated', (listingId: string) => {
      this.queue.enqueue({
        type: 'update',
        listingId,
        timestamp: new Date(),
      });
    });

    // 監聽 listing 刪除事件
    syncEventEmitter.on('listing:deleted', (listingId: string) => {
      this.queue.enqueue({
        type: 'delete',
        listingId,
        timestamp: new Date(),
      });
    });
  }

  /**
   * 全量同步（重建索引）
   */
  async fullSync(): Promise<{ indexed: number; errors: number }> {
    console.log('🔄 開始全量同步...');

    let indexed = 0;
    let errors = 0;
    const batchSize = 100;
    let skip = 0;

    // 清空現有索引
    await meilisearchService.clearIndex();

    while (true) {
      const listings = await prisma.listing.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          images: {
            where: { isCover: true },
            take: 1,
          },
          user: {
            select: { id: true, name: true },
          },
        },
        skip,
        take: batchSize,
      });

      if (listings.length === 0) break;

      try {
        const documents: ListingDocument[] = listings.map(listing => {
          const amenities: string[] =
            typeof listing.amenities === 'string'
              ? (JSON.parse(listing.amenities) as string[])
              : (listing.amenities || []);

          return {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            currency: listing.currency,
            propertyType: listing.propertyType,
            beds: listing.beds,
            baths: listing.baths,
            area: listing.area ? Number(listing.area) : null,
            address: listing.address,
            city: listing.city,
            district: listing.district,
            _geo:
              listing.latitude && listing.longitude
                ? {
                    lat: Number(listing.latitude),
                    lng: Number(listing.longitude),
                  }
                : null,
            amenities,
            status: listing.status,
            coverImage: listing.images[0]?.url || null,
            viewCount: listing.viewCount,
            userId: listing.userId,
            userName: listing.user.name,
            createdAt: listing.createdAt.getTime(),
            updatedAt: listing.updatedAt.getTime(),
          };
        });

        await meilisearchService.indexDocuments(documents);
        indexed += documents.length;
      } catch (error) {
        console.error(`批次 ${skip}-${skip + batchSize} 同步失敗:`, error);
        errors += listings.length;
      }

      skip += batchSize;
      console.log(`📊 已同步 ${indexed} 筆房源...`);
    }

    console.log(`✅ 全量同步完成: ${indexed} 筆成功, ${errors} 筆失敗`);
    return { indexed, errors };
  }
}

// ==================== 輔助函數 ====================

/**
 * 觸發 listing 建立事件
 */
export function emitListingCreated(listingId: string): void {
  syncEventEmitter.emit('listing:created', listingId);
}

/**
 * 觸發 listing 更新事件
 */
export function emitListingUpdated(listingId: string): void {
  syncEventEmitter.emit('listing:updated', listingId);
}

/**
 * 觸發 listing 刪除事件
 */
export function emitListingDeleted(listingId: string): void {
  syncEventEmitter.emit('listing:deleted', listingId);
}

// ==================== 匯出 ====================

export const syncWorker = new SyncWorker();






