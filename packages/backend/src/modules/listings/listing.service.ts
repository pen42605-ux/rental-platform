/**
 * Listing 服務層
 */
import prisma from '../../lib/prisma';
import { Prisma, PropertyType, ListingStatus } from '@prisma/client';
import { AppError } from '../../middleware/errorHandler';
import {
  CreateListingInput,
  UpdateListingInput,
  ListingQueryParams,
  ListingResponse,
  PaginatedListings,
} from './listing.types';
import { emitListingCreated, emitListingUpdated, emitListingDeleted } from '../search';

// ==================== 私有函數 ====================

function formatListingResponse(listing: any): ListingResponse {
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
    latitude: listing.latitude ? Number(listing.latitude) : null,
    longitude: listing.longitude ? Number(listing.longitude) : null,
    amenities: typeof listing.amenities === 'string' 
      ? JSON.parse(listing.amenities) 
      : (listing.amenities || []),
    status: listing.status,
    viewCount: listing.viewCount,
    userId: listing.userId,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    images: listing.images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      filename: img.filename,
      isCover: img.isCover,
      sortOrder: img.sortOrder,
    })) || [],
    user: listing.user ? {
      id: listing.user.id,
      name: listing.user.name,
      avatarUrl: listing.user.avatarUrl,
    } : undefined,
  };
}

// ==================== 服務類別 ====================

export class ListingService {
  /**
   * 建立房源
   */
  async create(userId: string, input: CreateListingInput): Promise<ListingResponse> {
    const { images, ...listingData } = input;

    const listing = await prisma.listing.create({
      data: {
        userId,
        title: listingData.title,
        description: listingData.description || null,
        price: listingData.price,
        currency: listingData.currency || 'TWD',
        propertyType: listingData.propertyType,
        beds: listingData.beds || 1,
        baths: listingData.baths || 1,
        area: listingData.area ?? null,
        address: listingData.address || null,
        city: listingData.city, // 必填，已在 controller 驗證
        district: listingData.district, // 必填，已在 controller 驗證
        latitude: listingData.latitude ?? null,
        longitude: listingData.longitude ?? null,
        amenities: JSON.stringify(listingData.amenities || []),
        status: listingData.status || 'DRAFT',
        images: images ? {
          create: images.map((img, index) => ({
            key: img.key,
            url: img.url,
            bucket: img.bucket,
            filename: img.filename,
            mimeType: img.mimeType,
            size: img.size,
            width: img.width ?? null,
            height: img.height ?? null,
            isCover: img.isCover ?? index === 0,
            sortOrder: img.sortOrder ?? index,
          })),
        } : undefined,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // 觸發搜尋同步事件
    emitListingCreated(listing.id);

    return formatListingResponse(listing);
  }

  /**
   * 更新房源
   */
  async update(
    listingId: string,
    userId: string,
    input: UpdateListingInput,
    isAdmin = false
  ): Promise<ListingResponse> {
    // 檢查權限
    const existing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existing) {
      throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
    }

    if (!isAdmin && existing.userId !== userId) {
      throw new AppError('無權限編輯此房源', 403, 'FORBIDDEN');
    }

    const { addImages, removeImageIds, ...updateData } = input;

    // 刪除指定圖片
    if (removeImageIds && removeImageIds.length > 0) {
      await prisma.listingImage.deleteMany({
        where: {
          id: { in: removeImageIds },
          listingId,
        },
      });
    }

    // 更新房源
    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.description !== undefined && { 
          description: updateData.description || null 
        }),
        ...(updateData.price !== undefined && { price: updateData.price }),
        ...(updateData.currency && { currency: updateData.currency }),
        ...(updateData.propertyType && { propertyType: updateData.propertyType }),
        ...(updateData.beds !== undefined && { beds: updateData.beds }),
        ...(updateData.baths !== undefined && { baths: updateData.baths }),
        ...(updateData.area !== undefined && { 
          area: updateData.area ?? null 
        }),
        ...(updateData.address !== undefined && { 
          address: updateData.address || null 
        }),
        ...(updateData.city !== undefined && { 
          city: updateData.city || null 
        }),
        ...(updateData.district !== undefined && { 
          district: updateData.district || null 
        }),
        ...(updateData.latitude !== undefined && { 
          latitude: updateData.latitude ?? null 
        }),
        ...(updateData.longitude !== undefined && { 
          longitude: updateData.longitude ?? null 
        }),
        ...(updateData.amenities && { amenities: JSON.stringify(updateData.amenities) }),
        ...(updateData.status && { status: updateData.status }),
        // 新增圖片
        ...(addImages && {
          images: {
            create: addImages.map((img, index) => ({
              key: img.key,
              url: img.url,
              bucket: img.bucket,
              filename: img.filename,
              mimeType: img.mimeType,
              size: img.size,
              width: img.width ?? null,
              height: img.height ?? null,
              isCover: img.isCover ?? false,
              sortOrder: img.sortOrder ?? 100 + index,
            })),
          },
        }),
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // 觸發搜尋同步事件
    emitListingUpdated(listing.id);

    return formatListingResponse(listing);
  }

  /**
   * 取得單一房源
   */
  async getById(listingId: string, incrementView = false): Promise<ListingResponse> {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    if (!listing) {
      throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
    }

    // 增加瀏覽數
    if (incrementView) {
      await prisma.listing.update({
        where: { id: listingId },
        data: { viewCount: { increment: 1 } },
      });
    }

    return formatListingResponse(listing);
  }

  /**
   * 取得房源列表
   */
  async getList(params: ListingQueryParams): Promise<PaginatedListings> {
    const {
      page = 1,
      limit = 20,
      status,
      propertyType,
      userId,
      city,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const where: Prisma.ListingWhereInput = {
      ...(status && { status }),
      ...(propertyType && { propertyType }),
      ...(userId && { userId }),
      ...(city && { city }),
      ...(minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      },
    };

    const [listings, totalItems] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          images: {
            where: { isCover: true },
            take: 1,
          },
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      items: listings.map(formatListingResponse),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * 取得使用者的房源
   */
  async getByUser(userId: string, params: ListingQueryParams): Promise<PaginatedListings> {
    return this.getList({ ...params, userId });
  }

  /**
   * 刪除房源
   */
  async delete(listingId: string, userId: string, isAdmin = false): Promise<void> {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
    }

    if (!isAdmin && listing.userId !== userId) {
      throw new AppError('無權限刪除此房源', 403, 'FORBIDDEN');
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    // 觸發搜尋同步事件
    emitListingDeleted(listingId);
  }

  /**
   * 更新房源狀態（發布/下架）
   */
  async updateStatus(
    listingId: string,
    userId: string,
    status: ListingStatus,
    isAdmin = false
  ): Promise<ListingResponse> {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
    }

    if (!isAdmin && listing.userId !== userId) {
      throw new AppError('無權限修改此房源', 403, 'FORBIDDEN');
    }

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data: { status },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // 觸發搜尋同步事件
    emitListingUpdated(updated.id);

    return formatListingResponse(updated);
  }
}

export const listingService = new ListingService();
