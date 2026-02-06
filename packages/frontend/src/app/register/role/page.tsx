'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';

const ROLE_OPTIONS = [
  { value: 'USER', label: '房客/買家', icon: '👤', description: '尋找租屋或購屋' },
  { value: 'LANDLORD', label: '屋主/代理人', icon: '🏠', description: '出租或出售房屋', warning: '若為合法經紀業人員不得冒用"屋主/代理人"身份註冊' },
  { value: 'AGENT', label: '營業員/經紀人', icon: '💼', description: '提供專業服務' },
  { value: 'AGENCY', label: '仲介公司', icon: '🏢', description: '企業帳號' },
  { value: 'DEVELOPER', label: '建商/代銷', icon: '🏗️', description: '開發商帳號' },
];

function RoleSelectionPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { isAuthenticated } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'USER' | 'LANDLORD' | 'AGENT' | 'AGENCY' | 'DEVELOPER' | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, router, redirect]);

  const handleContinue = () => {
    if (!selectedRole) {
      return;
    }
    
    // 將選擇的身份存儲到 sessionStorage，然後跳轉到註冊頁面
    sessionStorage.setItem('registerRole', selectedRole);
    router.push(`/register?redirect=${encodeURIComponent(redirect)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white">
              🏠 租屋平台
            </h1>
          </Link>
          <p className="text-slate-400 mt-2">
            請選擇您的註冊身份
          </p>
        </div>

        {/* Role Selection Card */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">選擇註冊身份</h2>
            <p className="text-sm text-slate-400">
              請選擇最符合您身份的選項，這將決定您可以使用哪些功能
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRole === option.value
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/80'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={selectedRole === option.value}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="sr-only"
                />
                <div className="flex items-start w-full">
                  <span className="text-3xl mr-4 mt-1">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">{option.label}</div>
                    <p className="text-sm opacity-80">{option.description}</p>
                    {option.warning && selectedRole === option.value && (
                      <p className="text-xs text-amber-400 mt-2 bg-amber-500/10 p-2 rounded">
                        ⚠️ {option.warning}
                      </p>
                    )}
                  </div>
                  {selectedRole === option.value && (
                    <svg
                      className="w-6 h-6 text-amber-400 ml-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors text-center"
            >
              取消
            </Link>
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步 →
            </button>
          </div>

          {/* Facebook Login Option */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <p className="text-sm text-slate-400 text-center mb-4">
              或使用 Facebook 快速註冊
            </p>
            <div className="flex justify-center">
              <Link
                href={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                跳過身份選擇，直接註冊 →
              </Link>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← 返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RoleSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-secondary-500">
          載入中...
        </div>
      }
    >
      <RoleSelectionPageInner />
    </Suspense>
  );
}




