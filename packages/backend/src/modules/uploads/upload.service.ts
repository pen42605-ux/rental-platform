/**
 * 上傳服務 - S3 Presigned URL
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';
import { localUploadService } from './local-upload.service';

// ==================== 類型定義 ====================

export interface PresignRequest {
  filename: string;
  mimeType: string;
  size: number;
}

export interface PresignResponse {
  uploadUrl: string;
  key: string;
  url: string;
  bucket: string;
  expiresIn: number;
}

// ==================== 常量 ====================

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const PRESIGN_EXPIRY = 300; // 5 minutes

// ==================== 服務類別 ====================

export class UploadService {
  private s3Client: S3Client | null = null;

  private getS3Client(): S3Client {
    if (!this.s3Client) {
      const region = process.env.AWS_REGION || 'ap-northeast-1';
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

      if (!accessKeyId || !secretAccessKey) {
        throw new AppError(
          'S3 未配置，請設定 AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY 環境變數',
          503,
          'S3_NOT_CONFIGURED'
        );
      }

      this.s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
    return this.s3Client;
  }

  /**
   * 檢查是否使用本地儲存
   */
  private useLocalStorage(): boolean {
    const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    
    // 如果 S3 未配置，使用本地儲存
    return !bucket || !accessKeyId || !secretAccessKey;
  }

  /**
   * 生成 Presigned URL
   */
  async generatePresignedUrl(input: PresignRequest): Promise<PresignResponse> {
    const { filename, mimeType, size } = input;

    // 驗證 MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new AppError(
        `不支援的檔案格式，允許：${ALLOWED_MIME_TYPES.join(', ')}`,
        400,
        'INVALID_MIME_TYPE'
      );
    }

    // 驗證檔案大小
    if (size > MAX_FILE_SIZE) {
      throw new AppError(
        `檔案過大，最大 ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        400,
        'FILE_TOO_LARGE'
      );
    }

    // 如果 S3 未配置，使用本地儲存
    if (this.useLocalStorage()) {
      return localUploadService.generatePresignedUrl(input);
    }

    const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET;
    if (!bucket) {
      throw new AppError('S3 Bucket 未配置，請設定 S3_BUCKET 或 AWS_S3_BUCKET 環境變數', 503, 'S3_NOT_CONFIGURED');
    }

    // 生成唯一的 key
    const ext = filename.split('.').pop() || 'jpg';
    const key = `listings/${uuid()}.${ext}`;

    // 建立 S3 put command
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
      ContentLength: size,
    });

    // 生成 presigned URL
    const client = this.getS3Client();
    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: PRESIGN_EXPIRY,
    });

    // 計算檔案公開 URL
    const region = process.env.AWS_REGION || 'ap-northeast-1';
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return {
      uploadUrl,
      key,
      url,
      bucket,
      expiresIn: PRESIGN_EXPIRY,
    };
  }

  /**
   * 批次生成 Presigned URL
   */
  async generateMultiplePresignedUrls(
    inputs: PresignRequest[]
  ): Promise<PresignResponse[]> {
    // 如果使用本地儲存，使用本地服務
    if (this.useLocalStorage()) {
      return localUploadService.generateMultiplePresignedUrls(inputs);
    }
    return Promise.all(inputs.map(input => this.generatePresignedUrl(input)));
  }
}

export const uploadService = new UploadService();
