/**
 * Elasticsearch 範例實作
 * 這是一個參考範例，展示如何使用 Elasticsearch 實現相同功能
 */
import { Client } from '@elastic/elasticsearch';
import { SearchParams, ListingDocument, SearchResponse } from './search.types';

// ==================== Elasticsearch 配置 ====================

const INDEX_NAME = 'listings';

const INDEX_MAPPING = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      title: { 
        type: 'text',
        analyzer: 'ik_max_word',  // 中文分詞器
        search_analyzer: 'ik_smart',
      },
      description: { 
        type: 'text',
        analyzer: 'ik_max_word',
      },
      price: { type: 'integer' },
      currency: { type: 'keyword' },
      propertyType: { type: 'keyword' },
      beds: { type: 'integer' },
      baths: { type: 'integer' },
      area: { type: 'float' },
      address: { type: 'text' },
      city: { type: 'keyword' },
      district: { type: 'keyword' },
      location: { type: 'geo_point' },  // Elasticsearch 地理點類型
      amenities: { type: 'keyword' },
      status: { type: 'keyword' },
      coverImage: { type: 'keyword' },
      viewCount: { type: 'integer' },
      userId: { type: 'keyword' },
      userName: { type: 'text' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 0,
    analysis: {
      analyzer: {
        // 自定義中文分析器（如果沒有 IK 分詞器）
        chinese_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'cjk_width'],
        },
      },
    },
  },
};

// ==================== Elasticsearch 服務範例 ====================

export class ElasticsearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: process.env.ELASTICSEARCH_API_KEY ? {
        apiKey: process.env.ELASTICSEARCH_API_KEY,
      } : undefined,
    });
  }

  /**
   * 初始化索引
   */
  async initializeIndex(): Promise<void> {
    const exists = await this.client.indices.exists({ index: INDEX_NAME });
    
    if (!exists) {
      await this.client.indices.create({
        index: INDEX_NAME,
        body: INDEX_MAPPING,
      });
      console.log('✅ Elasticsearch 索引建立完成');
    }
  }

  /**
   * 搜尋房源（含地理距離查詢）
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const {
      q,
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

    // 建立查詢
    const must: any[] = [];
    const filter: any[] = [];

    // 狀態篩選
    filter.push({ term: { status: 'PUBLISHED' } });

    // 關鍵字搜尋
    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: ['title^3', 'description', 'address', 'city', 'district'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    // 價格範圍
    if (min_price !== undefined || max_price !== undefined) {
      const range: any = {};
      if (min_price !== undefined) range.gte = min_price;
      if (max_price !== undefined) range.lte = max_price;
      filter.push({ range: { price: range } });
    }

    // 房型篩選
    if (type) {
      filter.push({ term: { propertyType: type } });
    }

    // 臥室數
    if (beds !== undefined) {
      filter.push({ range: { beds: { gte: beds } } });
    }

    // 縣市/區域
    if (city) filter.push({ term: { city } });
    if (district) filter.push({ term: { district } });

    // 設施篩選
    if (amenities && amenities.length > 0) {
      filter.push({ terms: { amenities } });
    }

    // 地理距離篩選
    if (lat !== undefined && lng !== undefined && radius_km !== undefined) {
      filter.push({
        geo_distance: {
          distance: `${radius_km}km`,
          location: { lat, lon: lng },
        },
      });
    }

    // 建立排序
    const sortClause = this.buildSort(sort, lat, lng);

    // 執行搜尋
    const response = await this.client.search({
      index: INDEX_NAME,
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }],
            filter,
          },
        },
        sort: sortClause,
        from: (page - 1) * limit,
        size: limit,
        // 如果有座標，加入距離計算
        ...(lat !== undefined && lng !== undefined ? {
          script_fields: {
            distance: {
              script: {
                source: "doc['location'].arcDistance(params.lat, params.lon)",
                params: { lat, lon: lng },
              },
            },
          },
        } : {}),
        // Aggregations (facets)
        aggs: {
          propertyType: { terms: { field: 'propertyType' } },
          city: { terms: { field: 'city' } },
          amenities: { terms: { field: 'amenities' } },
        },
      },
    });

    const hits = response.hits.hits;
    const total = typeof response.hits.total === 'number' 
      ? response.hits.total 
      : response.hits.total?.value || 0;

    return {
      items: hits.map((hit: any) => ({
        ...hit._source,
        _score: hit._score,
        _distance: hit.fields?.distance?.[0],
      })),
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
      meta: {
        query: q || '',
        processingTimeMs: response.took,
        facets: {
          propertyType: this.extractAggBuckets(response.aggregations?.propertyType),
          city: this.extractAggBuckets(response.aggregations?.city),
          amenities: this.extractAggBuckets(response.aggregations?.amenities),
        },
      },
    };
  }

  /**
   * 索引文檔
   */
  async indexDocument(document: ListingDocument): Promise<void> {
    // 轉換地理座標格式
    const doc = {
      ...document,
      location: document._geo ? {
        lat: document._geo.lat,
        lon: document._geo.lng,
      } : null,
    };
    delete (doc as any)._geo;

    await this.client.index({
      index: INDEX_NAME,
      id: document.id,
      body: doc,
      refresh: true,
    });
  }

  /**
   * 批次索引
   */
  async bulkIndex(documents: ListingDocument[]): Promise<void> {
    const operations = documents.flatMap(doc => {
      const body = {
        ...doc,
        location: doc._geo ? { lat: doc._geo.lat, lon: doc._geo.lng } : null,
      };
      delete (body as any)._geo;

      return [
        { index: { _index: INDEX_NAME, _id: doc.id } },
        body,
      ];
    });

    await this.client.bulk({ body: operations, refresh: true });
  }

  /**
   * 刪除文檔
   */
  async deleteDocument(id: string): Promise<void> {
    await this.client.delete({
      index: INDEX_NAME,
      id,
      refresh: true,
    });
  }

  // ==================== 私有方法 ====================

  private buildSort(sort: string, lat?: number, lng?: number): any[] {
    switch (sort) {
      case 'price_asc':
        return [{ price: 'asc' }];
      case 'price_desc':
        return [{ price: 'desc' }];
      case 'newest':
        return [{ createdAt: 'desc' }];
      case 'nearest':
        if (lat !== undefined && lng !== undefined) {
          return [{
            _geo_distance: {
              location: { lat, lon: lng },
              order: 'asc',
              unit: 'km',
            },
          }];
        }
        return [{ createdAt: 'desc' }];
      default:
        return [{ _score: 'desc' }];
    }
  }

  private extractAggBuckets(agg: any): Record<string, number> {
    if (!agg?.buckets) return {};
    return agg.buckets.reduce((acc: Record<string, number>, bucket: any) => {
      acc[bucket.key] = bucket.doc_count;
      return acc;
    }, {});
  }
}

// ==================== 使用範例 ====================
/*

// 1. 關鍵字搜尋
GET /api/search?q=捷運近套房

// 2. 價格範圍搜尋
GET /api/search?min_price=8000&max_price=15000

// 3. 地理距離搜尋（台北車站 3 公里內）
GET /api/search?lat=25.0478&lng=121.5170&radius_km=3

// 4. 距離排序
GET /api/search?lat=25.0478&lng=121.5170&sort=nearest

// 5. 複合搜尋
GET /api/search?q=套房&city=台北市&min_price=10000&max_price=20000&type=STUDIO&beds=1&lat=25.0478&lng=121.5170&radius_km=5&sort=price_asc

*/


