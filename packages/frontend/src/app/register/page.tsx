'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import FacebookLoginButton from '@/components/auth/FacebookLoginButton';
import { CITIES } from '@/lib/utils';
import { getDistrictsByCity } from '@/lib/districts';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { setAuth, isAuthenticated } = useAuthStore();

  // 從 sessionStorage 讀取選擇的身份
  const [role, setRole] = useState<'USER' | 'LANDLORD' | 'AGENT' | 'AGENCY' | 'DEVELOPER' | null>(null);

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: '' as '' | 'MALE' | 'FEMALE',
    referralSource: '',
    
    // 聯絡資訊
    lineUrl: '',
    
    // 緊急聯絡人（AGENT, AGENCY 需要）
    emergencyContactRelation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    
    // 工作相關（AGENT, AGENCY 需要）
    workArea: '',
    companyId: '',
    companyName: '',
    branchId: '',
    branchName: '',
    branchType: '' as '' | 'DIRECT' | 'FRANCHISE',
    position: '',
    brokerageName: '',
    hideCompanyInfo: false,
    
    // 公司相關（AGENCY, DEVELOPER 需要）
    accountType: '' as '' | 'GROUP' | 'BRANCH' | 'OTHER',
    companyNameFull: '',
    
    // 發票相關
    invoiceMethod: '' as '' | 'DONATE' | 'CLOUD' | 'UNIFIED' | 'MOBILE',
    unifiedNumber: '', // 統一編號
    // 對中寄送（雲端發票）欄位
    invoiceBuyer: '', // 買受人
    invoicePhone: '', // 發票聯絡電話
    invoiceCity: '', // 發票收件縣市
    invoiceDistrict: '', // 發票收件區域
    invoiceAddress: '', // 發票收件完整地址
    // 電子發票手機載具欄位
    mobileCarrier: '', // 手機載具條碼
    mobileCarrierConfirm: '', // 再次確認手機載具條碼
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
      return;
    }
    // 從 sessionStorage 讀取選擇的身份
    if (typeof window !== 'undefined') {
      const storedRole = sessionStorage.getItem('registerRole');
      if (storedRole && ['USER', 'LANDLORD', 'AGENT', 'AGENCY', 'DEVELOPER'].includes(storedRole)) {
        setRole(storedRole as 'USER' | 'LANDLORD' | 'AGENT' | 'AGENCY' | 'DEVELOPER');
      } else {
        // 如果沒有選擇身份，重定向到選身份頁面
        router.push(`/register/role?redirect=${encodeURIComponent(redirect)}`);
      }
    }
  }, [isAuthenticated, router, redirect]);

  // 發送驗證碼
  const handleSendCode = async () => {
    if (!registerData.phone.trim()) {
      toast.error('請先輸入手機號碼');
      return;
    }

    if (!/^09\d{8}$/.test(registerData.phone)) {
      toast.error('請輸入有效的手機號碼（格式：09XXXXXXXX）');
      return;
    }

    setSendingCode(true);
    try {
      await api.post('/api/auth/verification/send', {
        phone: registerData.phone,
      });
      toast.success('驗證碼已發送');
      setCodeSent(true);
      setCountdown(60);
      
      // 倒計時
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        '發送驗證碼失敗';
      toast.error(errorMessage);
    } finally {
      setSendingCode(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast.error('請先選擇註冊身份');
      router.push(`/register/role?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    
    // 驗證必填欄位（針對 USER 和 LANDLORD 角色）
    if (role === 'USER' || role === 'LANDLORD') {
      if (!registerData.phone.trim()) {
        toast.error('請輸入行動電話');
        return;
      }
      if (!registerData.gender) {
        toast.error('請選擇性別');
        return;
      }
      if (!verificationCode.trim()) {
        toast.error('請輸入手機驗證碼');
        return;
      }
      if (!agreeToTerms) {
        toast.error('請同意服務條款');
        return;
      }
    }

    // AGENT 角色驗證
    if (role === 'AGENT') {
      if (!registerData.phone.trim()) {
        toast.error('請輸入行動電話');
        return;
      }
      if (!registerData.emergencyContactRelation) {
        toast.error('請選擇緊急聯絡人身份');
        return;
      }
      if (!registerData.workArea.trim()) {
        toast.error('請填寫工作區域');
        return;
      }
      if (!registerData.companyName.trim() && !registerData.companyId) {
        toast.error('請選擇或輸入所屬公司');
        return;
      }
      if (!registerData.branchName.trim() && !registerData.branchId) {
        toast.error('請選擇或輸入分店');
        return;
      }
      if (!registerData.branchType) {
        toast.error('請選擇分店型態');
        return;
      }
      if (!registerData.position) {
        toast.error('請選擇所屬職位');
        return;
      }
      if (!registerData.brokerageName.trim()) {
        toast.error('請填寫經紀業名稱');
        return;
      }
      if (!registerData.invoiceMethod) {
        toast.error('請選擇發票處理方式');
        return;
      }
      
      // 對中寄送（雲端發票）驗證
      if (registerData.invoiceMethod === 'CLOUD') {
        if (!registerData.invoiceBuyer.trim()) {
          toast.error('請填寫買受人');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 統一編號驗證
      if (registerData.invoiceMethod === 'UNIFIED') {
        if (!registerData.unifiedNumber.trim()) {
          toast.error('請填寫統一編號');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 電子發票手機載具驗證
      if (registerData.invoiceMethod === 'MOBILE') {
        if (!registerData.mobileCarrier.trim()) {
          toast.error('請輸入手機載具條碼');
          return;
        }
        if (registerData.mobileCarrier !== registerData.mobileCarrierConfirm) {
          toast.error('手機載具條碼不一致');
          return;
        }
      }
      
      if (!agreeToTerms) {
        toast.error('請同意服務條款');
        return;
      }
    }

    // AGENCY 角色驗證
    if (role === 'AGENCY') {
      if (!registerData.phone.trim()) {
        toast.error('請輸入行動電話');
        return;
      }
      if (!registerData.accountType) {
        toast.error('請選擇賬號歸屬');
        return;
      }
      if (!registerData.emergencyContactRelation) {
        toast.error('請選擇緊急聯絡人身份');
        return;
      }
      if (!registerData.workArea.trim()) {
        toast.error('請填寫工作區域');
        return;
      }
      if (!registerData.companyName.trim() && !registerData.companyId) {
        toast.error('請選擇或輸入所屬公司');
        return;
      }
      if (!registerData.branchName.trim() && !registerData.branchId) {
        toast.error('請選擇或輸入分店');
        return;
      }
      if (!registerData.branchType) {
        toast.error('請選擇分店型態');
        return;
      }
      if (!registerData.position) {
        toast.error('請選擇所屬職位');
        return;
      }
      if (!registerData.brokerageName.trim()) {
        toast.error('請填寫經紀業名稱');
        return;
      }
      if (!registerData.invoiceMethod) {
        toast.error('請選擇發票處理方式');
        return;
      }
      
      // 對中寄送（雲端發票）驗證
      if (registerData.invoiceMethod === 'CLOUD') {
        if (!registerData.invoiceBuyer.trim()) {
          toast.error('請填寫買受人');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 統一編號驗證
      if (registerData.invoiceMethod === 'UNIFIED') {
        if (!registerData.unifiedNumber.trim()) {
          toast.error('請填寫統一編號');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 電子發票手機載具驗證
      if (registerData.invoiceMethod === 'MOBILE') {
        if (!registerData.mobileCarrier.trim()) {
          toast.error('請輸入手機載具條碼');
          return;
        }
        if (registerData.mobileCarrier !== registerData.mobileCarrierConfirm) {
          toast.error('手機載具條碼不一致');
          return;
        }
      }
      
      if (!agreeToTerms) {
        toast.error('請同意服務條款');
        return;
      }
    }

    // DEVELOPER 角色驗證
    if (role === 'DEVELOPER') {
      if (!registerData.phone.trim()) {
        toast.error('請輸入行動電話');
        return;
      }
      if (!registerData.companyNameFull.trim()) {
        toast.error('請填寫公司名稱');
        return;
      }
      if (!registerData.invoiceMethod) {
        toast.error('請選擇發票處理方式');
        return;
      }
      
      // 對中寄送（雲端發票）驗證
      if (registerData.invoiceMethod === 'CLOUD') {
        if (!registerData.invoiceBuyer.trim()) {
          toast.error('請填寫買受人');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 統一編號驗證
      if (registerData.invoiceMethod === 'UNIFIED') {
        if (!registerData.unifiedNumber.trim()) {
          toast.error('請填寫統一編號');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 電子發票手機載具驗證
      if (registerData.invoiceMethod === 'MOBILE') {
        if (!registerData.mobileCarrier.trim()) {
          toast.error('請輸入手機載具條碼');
          return;
        }
        if (registerData.mobileCarrier !== registerData.mobileCarrierConfirm) {
          toast.error('手機載具條碼不一致');
          return;
        }
      }
      
      if (!agreeToTerms) {
        toast.error('請同意服務條款');
        return;
      }
    }

    // LANDLORD 角色需要選擇發票處理方式
    if (role === 'LANDLORD') {
      if (!registerData.invoiceMethod) {
        toast.error('請選擇發票處理方式');
        return;
      }
      
      // 對中寄送（雲端發票）驗證
      if (registerData.invoiceMethod === 'CLOUD') {
        if (!registerData.invoiceBuyer.trim()) {
          toast.error('請填寫買受人');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 統一編號驗證
      if (registerData.invoiceMethod === 'UNIFIED') {
        if (!registerData.unifiedNumber.trim()) {
          toast.error('請填寫統一編號');
          return;
        }
        if (!registerData.invoicePhone.trim()) {
          toast.error('請填寫聯絡電話');
          return;
        }
        if (!registerData.invoiceCity) {
          toast.error('請選擇收件縣市');
          return;
        }
        if (!registerData.invoiceDistrict.trim()) {
          toast.error('請選擇或輸入收件區域');
          return;
        }
        if (!registerData.invoiceAddress.trim()) {
          toast.error('請填寫完整的收件地址');
          return;
        }
      }
      
      // 電子發票手機載具驗證
      if (registerData.invoiceMethod === 'MOBILE') {
        if (!registerData.mobileCarrier.trim()) {
          toast.error('請輸入手機載具條碼');
          return;
        }
        if (registerData.mobileCarrier !== registerData.mobileCarrierConfirm) {
          toast.error('手機載具條碼不一致');
          return;
        }
      }
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('密碼不一致');
      return;
    }

    if (registerData.password.length < 8) {
      toast.error('密碼至少需要 8 個字元');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/api/auth/register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone || undefined,
        role: role,
        gender: registerData.gender || undefined,
        referralSource: registerData.referralSource || undefined,
        lineUrl: registerData.lineUrl || undefined,
        emergencyContactRelation: (role === 'AGENT' || role === 'AGENCY') ? registerData.emergencyContactRelation : undefined,
        emergencyContactName: (role === 'AGENT' || role === 'AGENCY') ? registerData.emergencyContactName : undefined,
        emergencyContactPhone: (role === 'AGENT' || role === 'AGENCY') ? registerData.emergencyContactPhone : undefined,
        workArea: (role === 'AGENT' || role === 'AGENCY') ? registerData.workArea : undefined,
        companyId: (role === 'AGENT' || role === 'AGENCY') ? registerData.companyId : undefined,
        companyName: (role === 'AGENT' || role === 'AGENCY') ? registerData.companyName : undefined,
        branchId: (role === 'AGENT' || role === 'AGENCY') ? registerData.branchId : undefined,
        branchName: (role === 'AGENT' || role === 'AGENCY') ? registerData.branchName : undefined,
        branchType: (role === 'AGENT' || role === 'AGENCY') ? registerData.branchType : undefined,
        position: (role === 'AGENT' || role === 'AGENCY') ? registerData.position : undefined,
        brokerageName: (role === 'AGENT' || role === 'AGENCY') ? registerData.brokerageName : undefined,
        hideCompanyInfo: (role === 'AGENT' || role === 'AGENCY') ? registerData.hideCompanyInfo : undefined,
        accountType: role === 'AGENCY' ? registerData.accountType : undefined,
        companyNameFull: role === 'DEVELOPER' ? registerData.companyNameFull : undefined,
        invoiceMethod: (role === 'LANDLORD' || role === 'AGENT' || role === 'AGENCY' || role === 'DEVELOPER') ? registerData.invoiceMethod : undefined,
        unifiedNumber: registerData.invoiceMethod === 'UNIFIED' ? registerData.unifiedNumber : undefined,
        invoiceBuyer: registerData.invoiceMethod === 'CLOUD' ? registerData.invoiceBuyer : undefined,
        invoicePhone: (registerData.invoiceMethod === 'CLOUD' || registerData.invoiceMethod === 'UNIFIED') ? registerData.invoicePhone : undefined,
        invoiceCity: (registerData.invoiceMethod === 'CLOUD' || registerData.invoiceMethod === 'UNIFIED') ? registerData.invoiceCity : undefined,
        invoiceDistrict: (registerData.invoiceMethod === 'CLOUD' || registerData.invoiceMethod === 'UNIFIED') ? registerData.invoiceDistrict : undefined,
        invoiceAddress: (registerData.invoiceMethod === 'CLOUD' || registerData.invoiceMethod === 'UNIFIED') ? registerData.invoiceAddress : undefined,
        mobileCarrier: registerData.invoiceMethod === 'MOBILE' ? registerData.mobileCarrier : undefined,
        verificationCode: (role === 'USER' || role === 'LANDLORD') ? verificationCode : undefined,
      });
      const { user, tokens } = res.data.data;
      
      // 清除 sessionStorage 中的身份選擇
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('registerRole');
      }
      
      setAuth(user, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      toast.success('註冊成功！');
      router.push(redirect);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || '註冊失敗';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/auth/login', loginData);
      const { user, tokens } = res.data.data;
      
      setAuth(user, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
      toast.success('登入成功！');
      router.push(redirect);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || '登入失敗';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 如果還沒有讀取到角色，顯示加載狀態
  if (!role && !isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-400">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 py-6">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Logo */}
        <div className="text-center mb-4">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white">
              🏠 租屋平台
            </h1>
          </Link>
          <p className="text-slate-400 mt-1 text-sm">
            {isLogin ? '登入您的帳號' : '建立新帳號'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 rounded-2xl p-5 shadow-xl border border-slate-700">
          {!isLogin ? (
            // Register Form
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-base font-semibold text-white">填寫會員資料</h2>
                    <p className="text-xs text-slate-400">
                      <span className="text-red-400">*</span> 號為必填項
                    </p>
                  </div>
                  <Link
                    href={`/register/role?redirect=${encodeURIComponent(redirect)}`}
                    className="text-xs text-amber-400 hover:text-amber-300 underline"
                  >
                    更改身份
                  </Link>
                </div>
                {/* 顯示當前選擇的身份 */}
                <div className="mt-2 p-2 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {role === 'USER' && '👤'}
                      {role === 'LANDLORD' && '🏠'}
                      {role === 'AGENT' && '💼'}
                      {role === 'AGENCY' && '🏢'}
                      {role === 'DEVELOPER' && '🏗️'}
                    </span>
                    <span className="text-sm font-medium text-slate-300">
                      {role === 'USER' && '房客/買家'}
                      {role === 'LANDLORD' && '屋主/代理人'}
                      {role === 'AGENT' && '營業員/經紀人'}
                      {role === 'AGENCY' && '仲介公司'}
                      {role === 'DEVELOPER' && '建商/代銷'}
                    </span>
                  </div>
                  {role === 'LANDLORD' && (
                    <p className="text-xs text-amber-400 mt-1">
                      ⚠️ 若為合法經紀業人員不得冒用&quot;屋主/代理人&quot;身份註冊
                    </p>
                  )}
                </div>
              </div>

              {/* 基本資料 - 使用兩欄布局 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    姓名 <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="您的姓名"
                      required
                      className="flex-1 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                    {(role === 'USER' || role === 'LANDLORD') && (
                      <div className="flex gap-1">
                        <label className="flex items-center px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                          <input
                            type="radio"
                            name="gender"
                            value="MALE"
                            checked={registerData.gender === 'MALE'}
                            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                            className="sr-only"
                          />
                          <span className={`text-xs ${registerData.gender === 'MALE' ? 'text-amber-400 font-medium' : 'text-slate-300'}`}>
                            先生
                          </span>
                        </label>
                        <label className="flex items-center px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                          <input
                            type="radio"
                            name="gender"
                            value="FEMALE"
                            checked={registerData.gender === 'FEMALE'}
                            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                            className="sr-only"
                          />
                          <span className={`text-xs ${registerData.gender === 'FEMALE' ? 'text-amber-400 font-medium' : 'text-slate-300'}`}>
                            女士
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 行動電話 - 所有角色都需要 */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  行動電話 <span className="text-red-400">*</span>
                  {(role === 'AGENT' || role === 'AGENCY') && (
                    <span className="text-xs text-slate-500 ml-1">
                      (註：如遇帳號問題等情況，得通知緊急聯絡人)
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, phone: e.target.value });
                      setCodeSent(false);
                      setVerificationCode('');
                    }}
                    placeholder="0912345678"
                    required
                    maxLength={10}
                    className="flex-1 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sendingCode || countdown > 0 || !registerData.phone.trim()}
                    className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {sendingCode
                      ? '發送中...'
                      : countdown > 0
                      ? `${countdown}秒`
                      : '發送驗證碼'}
                  </button>
                </div>
              </div>

              {/* 手機驗證碼 - 僅 USER 和 LANDLORD 需要 */}
              {(role === 'USER' || role === 'LANDLORD') && codeSent && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    輸入手機驗證碼 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                    }}
                    placeholder="請輸入 6 位數驗證碼"
                    required
                    maxLength={6}
                    className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                  />
                  <p className="mt-1 text-xs text-slate-400 text-center">
                    驗證碼已發送至 {registerData.phone}
                  </p>
                </div>
              )}

              {/* 緊急聯絡人 - AGENT 和 AGENCY 需要 */}
              {(role === 'AGENT' || role === 'AGENCY') && (
                <div className="mt-3 space-y-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                  <h3 className="text-xs font-semibold text-slate-300 mb-2">緊急聯絡人資訊</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        緊急聯絡人身份 <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={registerData.emergencyContactRelation}
                        onChange={(e) => setRegisterData({ ...registerData, emergencyContactRelation: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      >
                        <option value="">請選擇</option>
                        <option value="FAMILY">家人</option>
                        <option value="FRIEND">朋友</option>
                        <option value="COLLEAGUE">同事</option>
                        <option value="OTHER">其他</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        緊急聯絡人姓名
                      </label>
                      <input
                        type="text"
                        value={registerData.emergencyContactName}
                        onChange={(e) => setRegisterData({ ...registerData, emergencyContactName: e.target.value })}
                        placeholder="請輸入姓名"
                        className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        緊急聯絡人電話
                      </label>
                      <input
                        type="tel"
                        value={registerData.emergencyContactPhone}
                        onChange={(e) => setRegisterData({ ...registerData, emergencyContactPhone: e.target.value })}
                        placeholder="0912345678"
                        className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Line 網址 - AGENT, AGENCY 需要 */}
              {(role === 'AGENT' || role === 'AGENCY') && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Line <span className="text-slate-500 text-xs">（選填）</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">https://line.me/ti/p/</span>
                    <input
                      type="text"
                      value={registerData.lineUrl}
                      onChange={(e) => setRegisterData({ ...registerData, lineUrl: e.target.value })}
                      placeholder="補充完整網址"
                      className="flex-1 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    <a href="https://line.me/ti/p/" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                      如何獲得Line網址
                    </a>
                  </p>
                </div>
              )}

              {/* 密碼 - 使用兩欄布局 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    密碼 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="至少 8 個字元"
                      required
                      minLength={8}
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    密碼確認 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="再次輸入密碼"
                    required
                    className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 如何得知本站 - 所有角色都可以填 */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  如何得知本站 <span className="text-slate-500 text-xs">（選填）</span>
                </label>
                <select
                  value={registerData.referralSource}
                  onChange={(e) => setRegisterData({ ...registerData, referralSource: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  <option value="">請選擇</option>
                  <option value="SEARCH_ENGINE">搜尋引擎（Google、Yahoo等）</option>
                  <option value="SOCIAL_MEDIA">社群媒體（Facebook、Instagram等）</option>
                  <option value="FRIEND">親友介紹</option>
                  <option value="AD">廣告</option>
                  <option value="NEWSPAPER">報紙雜誌</option>
                  <option value="OTHER">其他</option>
                </select>
              </div>

              {/* AGENT 和 AGENCY 的其他資料 */}
              {(role === 'AGENT' || role === 'AGENCY') && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <h3 className="text-xs font-semibold text-slate-300 mb-3">其他資料</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        工作區域 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={registerData.workArea}
                        onChange={(e) => setRegisterData({ ...registerData, workArea: e.target.value })}
                        placeholder="請輸入工作區域"
                        required
                        className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        所屬公司 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={registerData.companyName}
                        onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                        placeholder="請選擇或輸入"
                        required
                        className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        分店 <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={registerData.branchName}
                        onChange={(e) => setRegisterData({ ...registerData, branchName: e.target.value })}
                        placeholder="請選擇或輸入"
                        required
                        className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        所屬職位 <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={registerData.position}
                        onChange={(e) => setRegisterData({ ...registerData, position: e.target.value })}
                        required
                        className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      >
                        <option value="">請選擇</option>
                        <option value="AGENT">營業員</option>
                        <option value="BROKER">經紀人</option>
                        <option value="MANAGER">店長</option>
                        <option value="ASSISTANT">助理</option>
                        <option value="OTHER">其他</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        分店型態 <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="branchType"
                            value="DIRECT"
                            checked={registerData.branchType === 'DIRECT'}
                            onChange={(e) => setRegisterData({ ...registerData, branchType: e.target.value as 'DIRECT' | 'FRANCHISE' })}
                            className="w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                            required
                          />
                          <span className="text-xs text-slate-300">直營店</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="branchType"
                            value="FRANCHISE"
                            checked={registerData.branchType === 'FRANCHISE'}
                            onChange={(e) => setRegisterData({ ...registerData, branchType: e.target.value as 'DIRECT' | 'FRANCHISE' })}
                            className="w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                            required
                          />
                          <span className="text-xs text-slate-300">加盟店</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        物件詳情頁、店鋪隱藏公司信息
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={registerData.hideCompanyInfo}
                          onChange={(e) => setRegisterData({ ...registerData, hideCompanyInfo: e.target.checked })}
                          className="w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 rounded focus:ring-amber-500 focus:ring-2"
                        />
                        <span className="text-xs text-slate-300">隱藏公司信息</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      經紀業名稱 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={registerData.brokerageName}
                      onChange={(e) => setRegisterData({ ...registerData, brokerageName: e.target.value })}
                      placeholder="依不動產經紀業管理條例規定，仲介業者應註明【經紀業名稱】"
                      required
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      若未註明，則依據：內政部98年10月26日內授中辦地字第098072518號函辦理。
                    </p>
                  </div>
                </div>
              )}

              {/* AGENCY 專屬字段 */}
              {role === 'AGENCY' && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    賬號歸屬 <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        value="GROUP"
                        checked={registerData.accountType === 'GROUP'}
                        onChange={(e) => setRegisterData({ ...registerData, accountType: e.target.value as 'GROUP' | 'BRANCH' | 'OTHER' })}
                        className="w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                        required
                      />
                      <span className="text-xs text-slate-300">集團賬號</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        value="BRANCH"
                        checked={registerData.accountType === 'BRANCH'}
                        onChange={(e) => setRegisterData({ ...registerData, accountType: e.target.value as 'GROUP' | 'BRANCH' | 'OTHER' })}
                        className="w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                        required
                      />
                      <span className="text-xs text-slate-300">分店賬號</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        value="OTHER"
                        checked={registerData.accountType === 'OTHER'}
                        onChange={(e) => setRegisterData({ ...registerData, accountType: e.target.value as 'GROUP' | 'BRANCH' | 'OTHER' })}
                        className="w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                        required
                      />
                      <span className="text-xs text-slate-300">其他</span>
                    </label>
                  </div>
                </div>
              )}

              {/* DEVELOPER 專屬字段 */}
              {role === 'DEVELOPER' && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <h3 className="text-xs font-semibold text-slate-300 mb-3">其他資料</h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      公司名稱 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={registerData.companyNameFull}
                      onChange={(e) => setRegisterData({ ...registerData, companyNameFull: e.target.value })}
                      placeholder="請輸入公司名稱"
                      required
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-xs text-blue-400">
                      注：為提升本站使用者體驗，站台推出新建案全面代刊登服務
                      如有新案需刊登，歡迎來電客服02-55722000，我們隨即安排編輯與您聯絡。
                    </p>
                  </div>
                </div>
              )}

              {/* 發票處理方式 - LANDLORD, AGENT, AGENCY, DEVELOPER 需要 */}
              {(role === 'LANDLORD' || role === 'AGENT' || role === 'AGENCY' || role === 'DEVELOPER') && (
                <>
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <h3 className="text-xs font-semibold text-slate-300 mb-3">發票處理方式</h3>
                    
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-2">
                        本網站消費依財政部規定，誠實開立統一發票！請先選擇發票處理方式：{' '}
                        <span className="text-red-400">*</span>
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-start p-3 bg-slate-700 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-600/50">
                          <input
                            type="radio"
                            name="invoiceMethod"
                            value="DONATE"
                            checked={registerData.invoiceMethod === 'DONATE'}
                            onChange={(e) => setRegisterData({ ...registerData, invoiceMethod: e.target.value as any })}
                            className="mt-0.5 mr-2 w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                            required
                          />
                          <div className="flex-1">
                            <span className="text-sm text-white font-medium">捐給慈善機構</span>
                            <p className="text-xs text-slate-400 mt-0.5">
                              樂善好施，救濟扶弱，受捐贈機關或團體：人間文教基金會，捐出無法再索取。
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start p-3 bg-slate-700 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-600/50">
                          <input
                            type="radio"
                            name="invoiceMethod"
                            value="CLOUD"
                            checked={registerData.invoiceMethod === 'CLOUD'}
                            onChange={(e) => setRegisterData({ ...registerData, invoiceMethod: e.target.value as any })}
                            className="mt-0.5 mr-2 w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                            required
                          />
                          <div className="flex-1">
                            <span className="text-sm text-white font-medium">對中寄送（雲端發票）</span>
                            <p className="text-xs text-slate-400 mt-0.5">
                              每逢單月26日進行發票兌獎作業，若發票中獎，會以站內簡訊通知您，並將中獎發票掛號寄出。
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start p-3 bg-slate-700 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-600/50">
                          <input
                            type="radio"
                            name="invoiceMethod"
                            value="UNIFIED"
                            checked={registerData.invoiceMethod === 'UNIFIED'}
                            onChange={(e) => setRegisterData({ ...registerData, invoiceMethod: e.target.value as any })}
                            className="mt-0.5 mr-2 w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                            required
                          />
                          <div className="flex-1">
                            <span className="text-sm text-white font-medium">開立統一編號（請仔細填寫, 以免寄失）</span>
                            <p className="text-xs text-slate-400 mt-0.5">
                              郵寄時間較長，平信寄出
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start p-3 bg-slate-700 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-600/50">
                          <input
                            type="radio"
                            name="invoiceMethod"
                            value="MOBILE"
                            checked={registerData.invoiceMethod === 'MOBILE'}
                            onChange={(e) => setRegisterData({ ...registerData, invoiceMethod: e.target.value as any })}
                            className="mt-0.5 mr-2 w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 focus:ring-amber-500 focus:ring-2"
                            required
                          />
                          <div className="flex-1">
                            <span className="text-sm text-white font-medium">電子發票手機載具</span>
                          </div>
                        </label>
                      </div>

                      {/* 對中寄送（雲端發票）詳細欄位 */}
                      {registerData.invoiceMethod === 'CLOUD' && (
                        <div className="mt-3 space-y-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                買受人 <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="text"
                                value={registerData.invoiceBuyer}
                                onChange={(e) => setRegisterData({ ...registerData, invoiceBuyer: e.target.value })}
                                placeholder="請輸入買受人姓名"
                                required
                                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                聯絡電話 <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="tel"
                                value={registerData.invoicePhone}
                                onChange={(e) => setRegisterData({ ...registerData, invoicePhone: e.target.value })}
                                placeholder="0912345678 或 02-12345678"
                                required
                                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              收件地址 <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                  value={registerData.invoiceCity}
                                  onChange={(e) => {
                                    setRegisterData({ ...registerData, invoiceCity: e.target.value, invoiceDistrict: '' });
                                  }}
                                  required
                                  className="px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                >
                                  <option value="">請選擇</option>
                                  {CITIES.map((city) => (
                                    <option key={city} value={city}>
                                      {city}
                                    </option>
                                  ))}
                                </select>
                                {registerData.invoiceCity && getDistrictsByCity(registerData.invoiceCity).length > 0 ? (
                                  <select
                                    value={registerData.invoiceDistrict}
                                    onChange={(e) => setRegisterData({ ...registerData, invoiceDistrict: e.target.value })}
                                    required
                                    className="px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  >
                                    <option value="">請選擇</option>
                                    {getDistrictsByCity(registerData.invoiceCity).map((district) => (
                                      <option key={district} value={district}>
                                        {district}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={registerData.invoiceDistrict}
                                    onChange={(e) => setRegisterData({ ...registerData, invoiceDistrict: e.target.value })}
                                    placeholder="請輸入區域"
                                    required
                                    disabled={!registerData.invoiceCity}
                                    className="px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                                  />
                                )}
                              </div>
                              <input
                                type="text"
                                value={registerData.invoiceAddress}
                                onChange={(e) => setRegisterData({ ...registerData, invoiceAddress: e.target.value })}
                                placeholder="請填寫完整的收件地址"
                                required
                                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 統一編號詳細欄位 */}
                      {registerData.invoiceMethod === 'UNIFIED' && (
                        <div className="mt-3 space-y-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                統一編號 <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="text"
                                value={registerData.unifiedNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                                  setRegisterData({ ...registerData, unifiedNumber: value });
                                }}
                                placeholder="請輸入 8 位數統一編號"
                                required
                                maxLength={8}
                                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                聯絡電話 <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="tel"
                                value={registerData.invoicePhone}
                                onChange={(e) => setRegisterData({ ...registerData, invoicePhone: e.target.value })}
                                placeholder="0912345678 或 02-12345678"
                                required
                                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">
                              收件地址 <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                  value={registerData.invoiceCity}
                                  onChange={(e) => {
                                    setRegisterData({ ...registerData, invoiceCity: e.target.value, invoiceDistrict: '' });
                                  }}
                                  required
                                  className="px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                >
                                  <option value="">請選擇</option>
                                  {CITIES.map((city) => (
                                    <option key={city} value={city}>
                                      {city}
                                    </option>
                                  ))}
                                </select>
                                {registerData.invoiceCity && getDistrictsByCity(registerData.invoiceCity).length > 0 ? (
                                  <select
                                    value={registerData.invoiceDistrict}
                                    onChange={(e) => setRegisterData({ ...registerData, invoiceDistrict: e.target.value })}
                                    required
                                    className="px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                  >
                                    <option value="">請選擇</option>
                                    {getDistrictsByCity(registerData.invoiceCity).map((district) => (
                                      <option key={district} value={district}>
                                        {district}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={registerData.invoiceDistrict}
                                    onChange={(e) => setRegisterData({ ...registerData, invoiceDistrict: e.target.value })}
                                    placeholder="請輸入區域"
                                    required
                                    disabled={!registerData.invoiceCity}
                                    className="px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all disabled:opacity-50"
                                  />
                                )}
                              </div>
                              <input
                                type="text"
                                value={registerData.invoiceAddress}
                                onChange={(e) => setRegisterData({ ...registerData, invoiceAddress: e.target.value })}
                                placeholder="請填寫完整的收件地址"
                                required
                                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 電子發票手機載具詳細欄位 */}
                      {registerData.invoiceMethod === 'MOBILE' && (
                        <div className="mt-3 space-y-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 mb-2">
                            <p className="text-xs text-blue-400">
                              您需持有手機載具，詳細說明{' '}
                              <a
                                href="https://www.einvoice.nat.gov.tw/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-blue-300"
                              >
                                &gt;&gt;
                              </a>
                              {' '}依據【消費通路開立電子發票試辦作業要點開立】
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                請輸入手機載具條碼 <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="text"
                                value={registerData.mobileCarrier}
                                onChange={(e) => setRegisterData({ ...registerData, mobileCarrier: e.target.value })}
                                placeholder="/ABCD1234"
                                required
                                className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-slate-300 mb-1">
                                再次確認手機載具條碼 <span className="text-red-400">*</span>
                              </label>
                              <input
                                type="text"
                                value={registerData.mobileCarrierConfirm}
                                onChange={(e) => setRegisterData({ ...registerData, mobileCarrierConfirm: e.target.value })}
                                placeholder="/ABCD1234"
                                required
                                className={`w-full px-3 py-2 text-sm bg-slate-700 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono ${
                                  registerData.mobileCarrier &&
                                  registerData.mobileCarrierConfirm &&
                                  registerData.mobileCarrier !== registerData.mobileCarrierConfirm
                                    ? 'border-red-500'
                                    : 'border-slate-600'
                                }`}
                              />
                              {registerData.mobileCarrier &&
                                registerData.mobileCarrierConfirm &&
                                registerData.mobileCarrier !== registerData.mobileCarrierConfirm && (
                                  <p className="mt-1 text-xs text-red-400">手機載具條碼不一致</p>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* 服務條款 - 所有角色都需要 */}
              <div className="flex items-start gap-2 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-amber-500 bg-slate-600 border-slate-500 rounded focus:ring-amber-500 focus:ring-2"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                  我已仔細閱讀並明瞭{' '}
                  <a href="/terms" target="_blank" className="text-amber-400 hover:text-amber-300 underline">
                    「服務條款」
                  </a>
                  、{' '}
                  <a href="/disclaimer" target="_blank" className="text-amber-400 hover:text-amber-300 underline">
                    「免責聲明」
                  </a>
                  、{' '}
                  <a href="/privacy" target="_blank" className="text-amber-400 hover:text-amber-300 underline">
                    「隱私權聲明」
                  </a>
                  、{' '}
                  <a href="/messaging-terms" target="_blank" className="text-amber-400 hover:text-amber-300 underline">
                    「即時通訊功能服務條款」
                  </a>
                  {(role === 'AGENT' || role === 'AGENCY') && (
                    <>
                      {' '}、{' '}
                      <a href="/brokerage-terms" target="_blank" className="text-amber-400 hover:text-amber-300 underline">
                        「不動產經紀業個人資料檔案安全維護管理辦法」
                      </a>
                    </>
                  )}{' '}
                  等所載內容及其意義，茲同意該等條款規定，並願遵守網站現今、嗣後規範的各種規則
                </label>
              </div>

              <div className="flex gap-3 mt-4">
                <Link
                  href={`/register/role?redirect=${encodeURIComponent(redirect)}`}
                  className="flex-1 px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors text-center"
                >
                  ← 返回
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '註冊中...' : '完成註冊'}
                </button>
              </div>
              
              {/* Facebook Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800 text-slate-400">或</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <FacebookLoginButton onLoading={setLoading} role={role || 'USER'} />
                  <p className="mt-3 text-xs text-center text-slate-400">
                    使用 Facebook 帳號註冊，會更快完成註冊喔！
                  </p>
                </div>
              </div>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  密碼
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登入中...' : '登入'}
              </button>
            </form>
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {isLogin ? '還沒有帳號？' : '已有帳號？'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                {isLogin ? '立即註冊' : '立即登入'}
              </button>
            </p>
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

