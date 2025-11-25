/**
 * 上傳服務 - S3 Presigned URL
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';

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
        throw new AppError('S3 未配置', 503, 'S3_NOT_CONFIGURED');
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

    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new AppError('S3 Bucket 未配置', 503, 'S3_NOT_CONFIGURED');
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
    return Promise.all(inputs.map(input => this.generatePresignedUrl(input)));
  }
}

export const uploadService = new UploadService();
