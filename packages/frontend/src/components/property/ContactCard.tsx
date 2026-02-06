'use client';

import { Phone, MessageCircle, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/types';

interface ContactCardProps {
  owner: UserProfile;
  onContact?: () => void;
}

export default function ContactCard({ owner, onContact }: ContactCardProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">聯絡房東</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 房東資訊 */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            {owner.avatarUrl && <AvatarImage src={owner.avatarUrl} />}
            <AvatarFallback className="bg-primary-100 text-primary-600 font-semibold">
              {owner.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-secondary-900">{owner.name}</p>
            <div className="flex items-center gap-1 text-sm text-secondary-500">
              <Shield className="w-3.5 h-3.5" />
              <span>
                {owner.role === 'AGENT' ? '仲介' : '房東'}
              </span>
              {owner.listingCount !== undefined && (
                <span className="ml-2">
                  {owner.listingCount} 筆房源
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 聯絡按鈕 */}
        <div className="space-y-2">
          <Button className="w-full" size="lg" onClick={onContact}>
            <Phone className="w-5 h-5 mr-2" />
            撥打電話
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            發送訊息
          </Button>
          <Button variant="ghost" className="w-full" size="lg">
            <Mail className="w-5 h-5 mr-2" />
            Email 聯絡
          </Button>
        </div>

        {/* 安全提示 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-800 text-xs leading-relaxed">
            提醒您：看屋時請注意人身安全，不要繳交任何費用作為預約保證金，
            簽約前請詳細閱讀合約內容。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
