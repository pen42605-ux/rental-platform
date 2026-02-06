import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UiPlaygroundPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="outline">Playground</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">UI 元件展示</h1>
          <p className="text-muted-foreground">
            這頁用來確認 `shadcn/ui` 已正確初始化，並可作為之後設計系統的起點。
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            回首頁
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>常用按鈕樣式</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            你可以依照既有 `primary-*` / `secondary-*` 色票調整 tokens。
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form</CardTitle>
            <CardDescription>Input / Label</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyword">關鍵字</Label>
              <Input id="keyword" placeholder="台北市、捷運站、關鍵字..." />
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button>送出</Button>
            <Button variant="outline">取消</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

