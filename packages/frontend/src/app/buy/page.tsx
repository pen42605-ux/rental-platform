'use client';

import { useState } from 'react';
import { Building2, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';

/**
 * 買房列表頁面
 */
export default function BuyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[{ label: '買房', href: '/buy' }, { label: '全部物件' }]}
          />
        </div>
      </div>

      {/* Page header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary-500" />
                買房
              </h1>
              <p className="text-muted-foreground mt-1">
                精選全台買賣物件，找到理想好房
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
            <TabsTrigger value="new">新建案</TabsTrigger>
            <TabsTrigger value="resale">中古屋</TabsTrigger>
            <TabsTrigger value="land">土地</TabsTrigger>
            <TabsTrigger value="shop">店面</TabsTrigger>
            <TabsTrigger value="office">辦公</TabsTrigger>
          </TabsList>

          <Separator className="my-4" />

          <TabsContent value="all">
            <EmptyState
              title="目前無可用物件"
              description="請稍後再試或調整搜尋條件"
              actionLabel="重新搜尋"
              onAction={() => {}}
            />
          </TabsContent>
          <TabsContent value="new">
            <EmptyState title="目前無新建案" description="嘗試其他類型" />
          </TabsContent>
          <TabsContent value="resale">
            <EmptyState title="目前無中古屋" description="嘗試其他類型或地區" />
          </TabsContent>
          <TabsContent value="land">
            <EmptyState title="目前無土地" description="嘗試其他類型" />
          </TabsContent>
          <TabsContent value="shop">
            <EmptyState title="目前無店面" description="嘗試其他類型" />
          </TabsContent>
          <TabsContent value="office">
            <EmptyState title="目前無辦公室" description="嘗試其他類型" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
