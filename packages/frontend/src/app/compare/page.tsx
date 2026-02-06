'use client';

import { ArrowLeftRight, Home, MapPin, Ruler, BedDouble, Bath } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import EmptyState from '@/components/common/EmptyState';

/**
 * 房源比較頁面 - 最多比較 4 筆房源的詳細資訊
 */
export default function ComparePage() {
  // TODO: 從 URL params 或 store 取得要比較的房源 IDs
  const compareListings: any[] = [];

  if (compareListings.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          type="no-results"
          title="請選擇至少 2 筆房源進行比較"
          description="回到搜尋結果頁，點擊比較按鈕加入房源"
          actionLabel="開始搜尋"
          onAction={() => (window.location.href = '/')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ArrowLeftRight className="w-7 h-7 text-primary-500" />
        <h1 className="text-2xl font-bold">房源比較</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left p-4 w-40 text-muted-foreground font-medium">
                比較項目
              </th>
              {compareListings.map((listing) => (
                <th key={listing.id} className="p-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
                    </CardContent>
                  </Card>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4 text-muted-foreground">租金/售價</td>
              {compareListings.map((listing) => (
                <td key={listing.id} className="p-4 text-center font-bold text-primary-600">
                  {listing.price}
                </td>
              ))}
            </tr>
            <tr className="border-t bg-muted/50">
              <td className="p-4 text-muted-foreground">房型</td>
              {compareListings.map((listing) => (
                <td key={listing.id} className="p-4 text-center">
                  <Badge variant="secondary">{listing.propertyType}</Badge>
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-4 text-muted-foreground">坪數</td>
              {compareListings.map((listing) => (
                <td key={listing.id} className="p-4 text-center">
                  {listing.area ? `${listing.area} 坪` : '-'}
                </td>
              ))}
            </tr>
            <tr className="border-t bg-muted/50">
              <td className="p-4 text-muted-foreground">格局</td>
              {compareListings.map((listing) => (
                <td key={listing.id} className="p-4 text-center">
                  {listing.beds} 房 / {listing.baths} 衛
                </td>
              ))}
            </tr>
            <tr className="border-t">
              <td className="p-4 text-muted-foreground">地區</td>
              {compareListings.map((listing) => (
                <td key={listing.id} className="p-4 text-center">
                  {listing.city} {listing.district}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
