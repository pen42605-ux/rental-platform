import { Home, SearchX, Heart, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateType = 'no-results' | 'no-favorites' | 'no-listings' | 'no-location';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const defaults: Record<EmptyStateType, { icon: React.ElementType; title: string; description: string }> = {
  'no-results': {
    icon: SearchX,
    title: '沒有找到符合條件的房源',
    description: '試試調整篩選條件或搜尋其他關鍵字',
  },
  'no-favorites': {
    icon: Heart,
    title: '還沒有收藏房源',
    description: '瀏覽房源時點擊愛心即可收藏，方便日後查看',
  },
  'no-listings': {
    icon: Home,
    title: '尚未刊登房源',
    description: '點擊下方按鈕開始刊登您的第一筆房源',
  },
  'no-location': {
    icon: MapPin,
    title: '無法取得您的位置',
    description: '請確認已開啟位置權限，或手動選擇地區',
  },
};

/**
 * 空狀態元件 - 用於列表無資料時的提示
 */
export default function EmptyState({
  type = 'no-results',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const config = defaults[type];
  const Icon = config.icon;

  return (
    <div className={cn('text-center py-16', className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title || config.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description || config.description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
