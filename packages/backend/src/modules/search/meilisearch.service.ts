/**
 * Meilisearch 服務
 * 處理搜尋引擎的索引和查詢操作
 */
import { MeiliSearch, Index, SearchParams as MeiliSearchParams } from 'meilisearch';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';
import {
  ListingDocument,
  SearchParams,
  SearchResult,
  SearchResponse,
  SortOption,
} from './search.types';

// ==================== 常量 ====================

const INDEX_NAME = 'listings';
const SEARCHABLE_ATTRIBUTES = [
  'title',
  'description',
  'address',
  'city',
  'district',
  'amenities',
];
const FILTERABLE_ATTRIBUTES = [
  'price',
  'propertyType',
  'beds',
  'baths',
  'area',
  'city',
  'district',
  'amenities',
  'status',
  'userId',
  '_geo',
];
const SORTABLE_ATTRIBUTES = [
  'price',
  'createdAt',
  'viewCount',
  '_geoPoint',
];

// ==================== 服務類別 ====================

export class MeilisearchService {
  private client: MeiliSearch | null = null;
  private index: Index | null = null;

  /**
   * 取得 Meilisearch 客戶端
   */
  private getClient(): MeiliSearch {
    if (!this.client) {
      const host = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
      const apiKey = process.env.MEILISEARCH_API_KEY || '';

      this.client = new MeiliSearch({
        host,
        apiKey,
      });
    }
    return this.client;
  }

  /**
   * 取得索引
   */
  private async getIndex(): Promise<Index> {
    if (!this.index) {
      const client = this.getClient();
      this.index = client.index(INDEX_NAME);
    }
    return this.index;
  }

  /**
   * 初始化索引（設定 schema）
   */
  async initializeIndex(): Promise<void> {
    try {
      const client = this.getClient();

      // 建立或取得索引
      await client.createIndex(INDEX_NAME, { primaryKey: 'id' });

      const index = await this.getIndex();

      // 設定可搜尋欄位
      await index.updateSearchableAttributes(SEARCHABLE_ATTRIBUTES);

      // 設定可篩選欄位
      await index.updateFilterableAttributes(FILTERABLE_ATTRIBUTES);

      // 設定可排序欄位
      await index.updateSortableAttributes(SORTABLE_ATTRIBUTES);

      // 設定排名規則（包含地理排序）
      await index.updateRankingRules([
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
      ]);

      // 設定 facets
      await index.updateFaceting({
        maxValuesPerFacet: 100,
      });

      console.log('✅ Meilisearch 索引初始化完成');
    } catch (error: any) {
      console.error('❌ Meilisearch 索引初始化失敗:', error.message);
      throw error;
    }
  }

  /**
   * 搜尋房源
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const index = await this.getIndex();

    const {
      q = '',
      min_price,
      max_price,
      type,
      beds,
      lat,
      lng,
      radius_km,
      sort = 'relevance',
      page = 1,
      limit = 20,
      amenities,
      city,
      district,
    } = params;

    // 建立篩選條件
    const filters: string[] = [];
    filters.push('status = "PUBLISHED"');

    if (min_price !== undefined) {
      filters.push(`price >= ${min_price}`);
    }
    if (max_price !== undefined) {
      filters.push(`price <= ${max_price}`);
    }
    if (type) {
      filters.push(`propertyType = "${type}"`);
    }
    if (beds !== undefined) {
      filters.push(`beds >= ${beds}`);
    }
    if (city) {
      filters.push(`city = "${city}"`);
    }
    if (district) {
      filters.push(`district = "${district}"`);
    }
    if (amenities && amenities.length > 0) {
      const amenityFilters = amenities.map(a => `amenities = "${a}"`).join(' AND ');
      filters.push(`(${amenityFilters})`);
    }

    // 地理篩選
    if (lat !== undefined && lng !== undefined && radius_km !== undefined) {
      const radiusMeters = radius_km * 1000;
      filters.push(`_geoRadius(${lat}, ${lng}, ${radiusMeters})`);
    }

    // 建立排序規則
    const sortRules = this.buildSortRules(sort, lat, lng);

    // 建立搜尋參數
    const searchParams: MeiliSearchParams = {
      filter: filters.join(' AND '),
      sort: sortRules,
      limit,
      offset: (page - 1) * limit,
      facets: ['propertyType', 'city', 'amenities'],
      attributesToHighlight: ['title', 'description'],
      showRankingScore: true,
    };

    try {
      const result = await index.search(q, searchParams);

      // 計算地理距離（如果有座標）
      let geoDistances: Record<string, number> = {};
      if (lat !== undefined && lng !== undefined) {
        geoDistances = this.calculateDistances(result.hits as ListingDocument[], lat, lng);
      }

      return {
        items: result.hits as ListingDocument[],
        pagination: {
          page,
          limit,
          totalItems: result.estimatedTotalHits || 0,
          totalPages: Math.ceil((result.estimatedTotalHits || 0) / limit),
        },
        meta: {
          query: q,
          processingTimeMs: result.processingTimeMs,
          facets: result.facetDistribution as SearchResult['facetDistribution'],
        },
      };
    } catch (error: any) {
      console.error('Meilisearch 搜尋錯誤:', error);
      throw new AppError('搜尋服務暫時無法使用', 503, 'SEARCH_UNAVAILABLE');
    }
  }

  /**
   * 索引單一文檔
   */
  async indexDocument(document: ListingDocument): Promise<void> {
    const index = await this.getIndex();
    await index.addDocuments([document]);
    console.log(`📝 已索引房源: ${document.id}`);
  }

  /**
   * 批次索引文檔
   */
  async indexDocuments(documents: ListingDocument[]): Promise<void> {
    if (documents.length === 0) return;

    const index = await this.getIndex();
    const task = await index.addDocuments(documents);
    console.log(`📝 已提交 ${documents.length} 筆房源索引，任務 ID: ${task.taskUid}`);
  }

  /**
   * 更新文檔
   */
  async updateDocument(document: ListingDocument): Promise<void> {
    const index = await this.getIndex();
    await index.updateDocuments([document]);
    console.log(`📝 已更新房源索引: ${document.id}`);
  }

  /**
   * 刪除文檔
   */
  async deleteDocument(documentId: string): Promise<void> {
    const index = await this.getIndex();
    await index.deleteDocument(documentId);
    console.log(`🗑️ 已刪除房源索引: ${documentId}`);
  }

  /**
   * 批次刪除文檔
   */
  async deleteDocuments(documentIds: string[]): Promise<void> {
    if (documentIds.length === 0) return;

    const index = await this.getIndex();
    await index.deleteDocuments(documentIds);
    console.log(`🗑️ 已刪除 ${documentIds.length} 筆房源索引`);
  }

  /**
   * 取得索引狀態
   */
  async getStats(): Promise<any> {
    const index = await this.getIndex();
    return await index.getStats();
  }

  /**
   * 清空索引
   */
  async clearIndex(): Promise<void> {
    const index = await this.getIndex();
    await index.deleteAllDocuments();
    console.log('🗑️ 已清空索引');
  }

  // ==================== 私有方法 ====================

  /**
   * 建立排序規則
   */
  private buildSortRules(sort: SortOption, lat?: number, lng?: number): string[] {
    switch (sort) {
      case 'price_asc':
        return ['price:asc'];
      case 'price_desc':
        return ['price:desc'];
      case 'newest':
        return ['createdAt:desc'];
      case 'nearest':
        if (lat !== undefined && lng !== undefined) {
          return [`_geoPoint(${lat}, ${lng}):asc`];
        }
        return ['createdAt:desc'];
      case 'relevance':
      default:
        return [];
    }
  }

  /**
   * 計算地理距離
   */
  private calculateDistances(
    hits: ListingDocument[],
    lat: number,
    lng: number
  ): Record<string, number> {
    const distances: Record<string, number> = {};

    for (const hit of hits) {
      if (hit._geo) {
        distances[hit.id] = this.haversineDistance(
          lat,
          lng,
          hit._geo.lat,
          hit._geo.lng
        );
      }
    }

    return distances;
  }

  /**
   * Haversine 公式計算地球表面兩點距離
   */
  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371e3; // 地球半徑（公尺）
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 距離（公尺）
  }
}

export const meilisearchService = new MeilisearchService();


