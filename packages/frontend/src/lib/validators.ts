/**
 * 表單驗證工具
 */

// Email 驗證
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 手機號碼驗證 (台灣)
export function isValidPhone(phone: string): boolean {
  const re = /^09\d{8}$/;
  return re.test(phone);
}

// 密碼強度驗證
export function isValidPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: '密碼至少需要 8 個字元' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個大寫字母' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個小寫字母' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: '密碼需包含至少一個數字' };
  }
  return { valid: true, message: '' };
}

// 價格驗證
export function isValidPrice(price: number): boolean {
  return price > 0 && price < 1000000000; // 10 億以下
}

// 面積驗證
export function isValidArea(area: number): boolean {
  return area > 0 && area < 10000; // 10000 坪以下
}

// 必填欄位驗證
export function isRequired(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

// 表單驗證結果
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 列表表單驗證
export function validateListingForm(data: {
  title?: string;
  description?: string;
  price?: number;
  city?: string;
  address?: string;
  propertyType?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(data.title)) {
    errors.title = '請輸入標題';
  } else if ((data.title?.length || 0) < 5) {
    errors.title = '標題至少需要 5 個字';
  }

  if (!isRequired(data.description)) {
    errors.description = '請輸入描述';
  } else if ((data.description?.length || 0) < 20) {
    errors.description = '描述至少需要 20 個字';
  }

  if (!data.price || !isValidPrice(data.price)) {
    errors.price = '請輸入有效的價格';
  }

  if (!isRequired(data.city)) {
    errors.city = '請選擇縣市';
  }

  if (!isRequired(data.address)) {
    errors.address = '請輸入地址';
  }

  if (!isRequired(data.propertyType)) {
    errors.propertyType = '請選擇房源類型';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
