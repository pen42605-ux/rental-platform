'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface FacebookLoginButtonProps {
  onLoading?: (loading: boolean) => void;
  role?: 'USER' | 'LANDLORD' | 'AGENT' | 'AGENCY' | 'DEVELOPER';
}

export default function FacebookLoginButton({ onLoading, role = 'USER' }: FacebookLoginButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { setAuth } = useAuthStore();
  const [fbReady, setFbReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 載入 Facebook SDK
    if (typeof window !== 'undefined' && !window.FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/zh_TW/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      window.fbAsyncInit = function () {
        const fbAppId = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_FACEBOOK_APP_ID) 
          ? process.env.NEXT_PUBLIC_FACEBOOK_APP_ID 
          : '';
        window.FB.init({
          appId: fbAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0',
        });
        setFbReady(true);
      };
    } else if (window.FB) {
      setFbReady(true);
    }
  }, []);

  const handleFacebookLogin = async () => {
    if (!fbReady || !window.FB) {
      toast.error('Facebook SDK 尚未載入，請稍候再試');
      return;
    }

    setLoading(true);
    onLoading?.(true);

    try {
      // 使用 Facebook Login API
      window.FB.login(
        async (response: any) => {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;

            // 調用後端 API
            try {
              const res = await api.post('/api/auth/facebook', { accessToken, role });
              const { user, tokens } = res.data.data;

              // 清除 sessionStorage 中的身份選擇（如果有的話）
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('registerRole');
              }

              setAuth(user, {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
              });

              toast.success('Facebook 登入成功！');
              router.push(redirect);
            } catch (error: any) {
              const errorMessage =
                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                'Facebook 登入失敗';
              toast.error(errorMessage);
            } finally {
              setLoading(false);
              onLoading?.(false);
            }
          } else {
            toast.error('Facebook 登入已取消');
            setLoading(false);
            onLoading?.(false);
          }
        },
        {
          scope: 'email,public_profile',
          return_scopes: true,
        }
      );
    } catch (error: any) {
      toast.error('Facebook 登入失敗，請稍候再試');
      setLoading(false);
      onLoading?.(false);
    }
  };

  const fbAppId = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_FACEBOOK_APP_ID) 
    ? process.env.NEXT_PUBLIC_FACEBOOK_APP_ID 
    : '';
  
  if (!fbAppId) {
    return null; // 如果沒有配置 Facebook App ID，不顯示按鈕
  }

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={loading || !fbReady}
      className="w-full flex items-center justify-center gap-3 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          <span>登入中...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
          <span>使用 Facebook 帳號登入</span>
        </>
      )}
    </button>
  );
}

