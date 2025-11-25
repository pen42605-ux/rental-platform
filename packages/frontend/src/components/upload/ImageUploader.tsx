'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhotoIcon,
  XMarkIcon,
  ArrowsUpDownIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { uploadApi } from '@/lib/api';
import toast from 'react-hot-toast';

export interface UploadedImage {
  id: string;
  file?: File;
  preview: string;
  key?: string;
  url?: string;
  bucket?: string;
  filename: string;
  mimeType: string;
  size: number;
  isCover: boolean;
  sortOrder: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress?: number;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
  maxSize?: number; // bytes
}

export default function ImageUploader({
  images,
  onChange,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  // 處理檔案選擇
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - images.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);

      if (filesToAdd.length < acceptedFiles.length) {
        toast.error(`最多只能上傳 ${maxFiles} 張圖片`);
      }

      // 建立新的圖片物件
      const newImages: UploadedImage[] = filesToAdd.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        isCover: images.length === 0 && index === 0,
        sortOrder: images.length + index,
        status: 'pending',
      }));

      const updatedImages = [...images, ...newImages];
      onChange(updatedImages);

      // 開始上傳
      for (const image of newImages) {
        await uploadImage(image, updatedImages);
      }
    },
    [images, maxFiles, onChange]
  );

  // 上傳單張圖片
  const uploadImage = async (image: UploadedImage, allImages: UploadedImage[]) => {
    if (!image.file) return;

    try {
      // 更新狀態為上傳中
      updateImageStatus(image.id, 'uploading', 0, allImages);

      // 取得 presigned URL
      const { data } = await uploadApi.getPresignedUrl({
        filename: image.filename,
        mimeType: image.mimeType,
        size: image.size,
      });

      const presignData = data.data;

      // 上傳到 S3
      await uploadApi.uploadToS3(presignData.uploadUrl, image.file);

      // 更新圖片資訊
      updateImageInfo(image.id, {
        key: presignData.key,
        url: presignData.url,
        bucket: presignData.bucket,
        status: 'done',
        progress: 100,
      }, allImages);

      toast.success(`${image.filename} 上傳成功`);
    } catch (error: any) {
      console.error('Upload error:', error);
      updateImageStatus(image.id, 'error', 0, allImages);
      toast.error(`${image.filename} 上傳失敗`);
    }
  };

  // 更新圖片狀態
  const updateImageStatus = (
    id: string,
    status: UploadedImage['status'],
    progress: number,
    allImages: UploadedImage[]
  ) => {
    const updated = allImages.map((img) =>
      img.id === id ? { ...img, status, progress } : img
    );
    onChange(updated);
  };

  // 更新圖片資訊
  const updateImageInfo = (
    id: string,
    info: Partial<UploadedImage>,
    allImages: UploadedImage[]
  ) => {
    const updated = allImages.map((img) =>
      img.id === id ? { ...img, ...info } : img
    );
    onChange(updated);
  };

  // 移除圖片
  const removeImage = (id: string) => {
    const removed = images.find((img) => img.id === id);
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }

    const updated = images.filter((img) => img.id !== id);
    
    // 如果移除的是封面，將第一張設為封面
    if (removed?.isCover && updated.length > 0) {
      updated[0].isCover = true;
    }

    // 重新計算排序
    updated.forEach((img, idx) => {
      img.sortOrder = idx;
    });

    onChange(updated);
  };

  // 設定封面
  const setCover = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isCover: img.id === id,
    }));
    onChange(updated);
  };

  // Dropzone 設定
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    maxSize,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
  });

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive || isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-200 hover:border-primary-400 hover:bg-secondary-50'
        }`}
      >
        <input {...getInputProps()} />
        <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-secondary-400" />
        <p className="text-secondary-700 font-medium mb-1">
          拖放圖片到這裡，或點擊選擇檔案
        </p>
        <p className="text-secondary-500 text-sm">
          支援 JPG、PNG、WebP、GIF，最多 {maxFiles} 張，每張最大 {maxSize / 1024 / 1024}MB
        </p>
        <p className="text-secondary-400 text-xs mt-2">
          已上傳 {images.length} / {maxFiles} 張
        </p>
      </div>

      {/* 圖片預覽列表 */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative aspect-square rounded-xl overflow-hidden bg-secondary-100 group"
              >
                <Image
                  src={image.preview}
                  alt={image.filename}
                  fill
                  className="object-cover"
                />

                {/* 上傳狀態 */}
                {image.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}

                {image.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                    <span className="text-white text-sm">上傳失敗</span>
                  </div>
                )}

                {/* 封面標籤 */}
                {image.isCover && (
                  <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <StarSolidIcon className="w-3 h-3" />
                    封面
                  </div>
                )}

                {/* 操作按鈕 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {/* 設為封面 */}
                  {!image.isCover && (
                    <button
                      onClick={() => setCover(image.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors"
                      title="設為封面"
                    >
                      <StarIcon className="w-5 h-5 text-primary-500" />
                    </button>
                  )}

                  {/* 移除 */}
                  <button
                    onClick={() => removeImage(image.id)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    title="移除"
                  >
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>

                {/* 排序序號 */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-black/60 text-white text-xs rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示 */}
      <p className="text-secondary-500 text-sm flex items-center gap-1">
        <ArrowsUpDownIcon className="w-4 h-4" />
        點擊星號可設定封面圖片
      </p>
    </div>
  );
}


