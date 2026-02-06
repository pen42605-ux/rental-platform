'use client';

import Link from 'next/link';
import {
  Sparkles,
  Home,
  MapPin,
  Building2,
  Store,
  Wrench,
  Users,
  BarChart3,
  Building,
} from 'lucide-react';

// 房源分類
const PROPERTY_CATEGORIES = [
  { name: '新建案', icon: Sparkles, href: '/buy?type=new', color: 'from-blue-500 to-blue-600' },
  { name: '中古屋', icon: Building, href: '/buy?type=resale', color: 'from-emerald-500 to-emerald-600' },
  { name: '租屋', icon: Home, href: '/rent', color: 'from-cyan-500 to-cyan-600' },
  { name: '土地', icon: MapPin, href: '/buy?type=land', color: 'from-amber-500 to-amber-600' },
  { name: '店面', icon: Store, href: '/buy?type=shop', color: 'from-purple-500 to-purple-600' },
  { name: '辦公', icon: Building2, href: '/buy?type=office', color: 'from-indigo-500 to-indigo-600' },
  { name: '廠房', icon: Wrench, href: '/buy?type=factory', color: 'from-slate-500 to-slate-600' },
  { name: '社區', icon: Users, href: '/community', color: 'from-rose-500 to-rose-600' },
];

export default function CategorySection() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-cyan-50 border-b border-blue-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-blue-900">房源分類</h2>
          <Sparkles className="w-6 h-6 text-blue-600" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {PROPERTY_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/80 hover:bg-white border-2 border-blue-200 hover:border-blue-400 transition-all group shadow-md hover:shadow-xl"
              >
                <div
                  className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white z-10" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-blue-900 group-hover:text-blue-600 transition-colors text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
