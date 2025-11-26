'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import { captureException } from '@/lib/sentry';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 發送錯誤到 Sentry
    captureException(error, {
      errorBoundary: true,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">發生錯誤</h2>
        <p className="text-slate-600 mb-6">
          {error.message || '發生未預期的錯誤'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
        >
          重試
        </button>
      </div>
    </div>
  );
}





