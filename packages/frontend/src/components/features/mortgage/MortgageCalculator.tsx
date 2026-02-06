'use client';

import { useState, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/lib/utils';

/**
 * 房貸試算器 - 等額本息 / 等額本金
 */
export default function MortgageCalculator() {
  const [totalPrice, setTotalPrice] = useState(10000000); // 總價 (元)
  const [downPaymentPercent, setDownPaymentPercent] = useState(20); // 頭期款比例
  const [interestRate, setInterestRate] = useState(2.0); // 年利率 (%)
  const [loanYears, setLoanYears] = useState(30); // 貸款年數

  const loanAmount = totalPrice * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanYears * 12;

  // 等額本息 (每月固定繳)
  const equalPayment = useMemo(() => {
    if (monthlyRate === 0) return loanAmount / totalMonths;
    return (
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  }, [loanAmount, monthlyRate, totalMonths]);

  // 等額本金 (第一個月最高，之後遞減)
  const firstMonthPayment = useMemo(() => {
    const principal = loanAmount / totalMonths;
    const interest = loanAmount * monthlyRate;
    return principal + interest;
  }, [loanAmount, monthlyRate, totalMonths]);

  const totalPayment = equalPayment * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary-500" />
          房貸試算器
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 總價 */}
        <div className="space-y-2">
          <Label htmlFor="totalPrice">房屋總價</Label>
          <div className="relative">
            <Input
              id="totalPrice"
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              元
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            約 {(totalPrice / 10000).toFixed(0)} 萬元
          </p>
        </div>

        {/* 頭期款比例 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>頭期款比例</Label>
            <span className="text-sm font-medium">{downPaymentPercent}%</span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            onValueChange={([val]) => setDownPaymentPercent(val)}
            min={10}
            max={50}
            step={5}
          />
          <p className="text-sm text-muted-foreground">
            頭期款約 {formatPrice(totalPrice * downPaymentPercent / 100)}
          </p>
        </div>

        {/* 利率 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>年利率</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>目前台灣一般房貸利率約 1.5% - 2.5%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Slider
              value={[interestRate * 10]}
              onValueChange={([val]) => setInterestRate(val / 10)}
              min={10}
              max={50}
              step={1}
              className="flex-1"
            />
            <span className="text-sm font-medium w-12 text-right">{interestRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* 貸款年數 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>貸款年數</Label>
            <span className="text-sm font-medium">{loanYears} 年</span>
          </div>
          <Slider
            value={[loanYears]}
            onValueChange={([val]) => setLoanYears(val)}
            min={5}
            max={40}
            step={5}
          />
        </div>

        {/* 試算結果 */}
        <Tabs defaultValue="equal-payment" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="equal-payment">等額本息</TabsTrigger>
            <TabsTrigger value="equal-principal">等額本金</TabsTrigger>
          </TabsList>
          <TabsContent value="equal-payment">
            <div className="bg-primary-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">每月繳款</span>
                <span className="font-bold text-primary-600 text-lg">
                  {formatPrice(Math.round(equalPayment))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">貸款金額</span>
                <span className="font-medium">{formatPrice(loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">利息總額</span>
                <span className="font-medium text-orange-600">
                  {formatPrice(Math.round(totalInterest))}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm text-muted-foreground">還款總額</span>
                <span className="font-bold">{formatPrice(Math.round(totalPayment))}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="equal-principal">
            <div className="bg-blue-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">首月繳款</span>
                <span className="font-bold text-blue-600 text-lg">
                  {formatPrice(Math.round(firstMonthPayment))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">每月遞減</span>
                <span className="font-medium">
                  約 {formatPrice(Math.round(loanAmount / totalMonths * monthlyRate))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">貸款金額</span>
                <span className="font-medium">{formatPrice(loanAmount)}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
