'use client';

import { useState } from 'react';
import { Home, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';

/**
 * 租屋列表頁面
 */
export default function RentPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[{ label: '租屋', href: '/rent' }, { label: '全部房源' }]}
          />
        </div>
      </div>

      {/* Page header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Home className="h-6 w-6 text-primary-500" />
                租屋
              </h1>
              <p className="text-muted-foreground mt-1">
                探索全台優質租屋房源
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-1" />
                地圖找房
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                篩選
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="studio">獨立套房</TabsTrigger>
            <TabsTrigger value="suite">分租套房</TabsTrigger>
            <TabsTrigger value="room">雅房</TabsTrigger>
            <TabsTrigger value="whole">整層住家</TabsTrigger>
          </TabsList>

          <Separator className="my-4" />

          <TabsContent value="all">
            <EmptyState
              title="目前無可用房源"
              description="請稍後再試或調整搜尋條件"
              actionLabel="重新搜尋"
              onAction={() => {}}
            />
          </TabsContent>
          <TabsContent value="studio">
            <EmptyState title="目前無獨立套房" description="嘗試其他房型或地區" />
          </TabsContent>
          <TabsContent value="suite">
            <EmptyState title="目前無分租套房" description="嘗試其他房型或地區" />
          </TabsContent>
          <TabsContent value="room">
            <EmptyState title="目前無雅房" description="嘗試其他房型或地區" />
          </TabsContent>
          <TabsContent value="whole">
            <EmptyState title="目前無整層住家" description="嘗試其他房型或地區" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
