/**
 * 表單驗證工具 (Form Validators)
 */

export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string): boolean => {
    // Taiwan phone number format: 09xxxxxxxx or 02-xxxxxxxx
    const phoneRegex = /^(09\d{8}|0[2-8]-?\d{7,8})$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },

  password: (value: string): { valid: boolean; message?: string } => {
    if (value.length < 8) {
      return { valid: false, message: '密碼至少需要 8 個字元' };
    }
    if (!/[A-Z]/.test(value)) {
      return { valid: false, message: '密碼需包含至少一個大寫字母' };
    }
    if (!/[a-z]/.test(value)) {
      return { valid: false, message: '密碼需包含至少一個小寫字母' };
    }
    if (!/[0-9]/.test(value)) {
      return { valid: false, message: '密碼需包含至少一個數字' };
    }
    return { valid: true };
  },

  required: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  min: (value: number, min: number): boolean => {
    return value >= min;
  },

  max: (value: number, max: number): boolean => {
    return value <= max;
  },

  range: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max;
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
};

export const messages = {
  required: '此欄位為必填',
  email: '請輸入有效的電子郵件地址',
  phone: '請輸入有效的電話號碼',
  minLength: (min: number) => `最少需要 ${min} 個字元`,
  maxLength: (max: number) => `最多只能 ${max} 個字元`,
  min: (min: number) => `最小值為 ${min}`,
  max: (max: number) => `最大值為 ${max}`,
  range: (min: number, max: number) => `數值需介於 ${min} 和 ${max} 之間`,
  url: '請輸入有效的網址',
};
