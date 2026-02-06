import { Metadata } from 'next';
import MortgageCalculator from '@/components/features/mortgage/MortgageCalculator';

export const metadata: Metadata = {
  title: '房貸試算器 | 好房網',
  description: '免費房貸計算器，快速試算每月房貸金額、利息總額，支援等額本息和等額本金兩種方式',
};

/**
 * 房貸試算器頁面
 */
export default function MortgageCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">房貸試算器</h1>
        <p className="text-muted-foreground mb-8">
          快速試算每月房貸金額，幫助您評估購屋預算
        </p>
        <MortgageCalculator />
      </div>
    </div>
  );
}
