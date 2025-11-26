# Prisma undefined 錯誤修復 ✅

## 🔍 問題原因

Prisma 不接受 `undefined` 值，但接受 `null`。當欄位是可選的（`?`）時，必須使用 `null` 而不是 `undefined`。

---

## ✅ 已修復的問題

### 1. Listing 建立時的 undefined 值

- ✅ `area: undefined` → `area: listingData.area ?? null`
- ✅ `latitude: undefined` → `latitude: listingData.latitude ?? null`
- ✅ `longitude: undefined` → `longitude: listingData.longitude ?? null`
- ✅ `description: undefined` → `description: listingData.description || null`
- ✅ `address: undefined` → `address: listingData.address || null`
- ✅ `city: undefined` → `city: listingData.city || null`
- ✅ `district: undefined` → `district: listingData.district || null`

### 2. ListingImage 建立時的 undefined 值

- ✅ `width: undefined` → `width: img.width ?? null`
- ✅ `height: undefined` → `height: img.height ?? null`

### 3. amenities 處理

- ✅ 建立時：`amenities: JSON.stringify(listingData.amenities || [])`
- ✅ 讀取時：解析 JSON 字串
- ✅ 更新時：同樣使用 JSON.stringify

---

## 🔧 修復內容

### 建立 Listing

```typescript
const listing = await prisma.listing.create({
  data: {
    // ... 其他欄位
    area: listingData.area ?? null,           // undefined → null
    latitude: listingData.latitude ?? null,   // undefined → null
    longitude: listingData.longitude ?? null, // undefined → null
    amenities: JSON.stringify(listingData.amenities || []), // 轉為 JSON 字串
    // ...
    images: {
      create: images.map((img) => ({
        // ...
        width: img.width ?? null,   // undefined → null
        height: img.height ?? null, // undefined → null
      })),
    },
  },
});
```

### 更新 Listing

```typescript
const listing = await prisma.listing.update({
  where: { id: listingId },
  data: {
    ...(updateData.area !== undefined && { 
      area: updateData.area ?? null 
    }),
    // ... 其他欄位同樣處理
  },
});
```

---

## 📝 重要說明

### `??` vs `||` 的區別

- `??` (Nullish Coalescing): 只在 `null` 或 `undefined` 時使用預設值
- `||` (Logical OR): 在所有 falsy 值（`false`, `0`, `''`, `null`, `undefined`）時使用預設值

**使用建議**：
- 數字欄位（`area`, `latitude`, `longitude`）: 使用 `??`（因為 `0` 是有效值）
- 字串欄位（`description`, `address`）: 使用 `||`（因為空字串可以轉為 `null`）

---

## ✅ 現在可以正常建立房源

修復後，建立房源時：
- ✅ 可選欄位可以為空
- ✅ 圖片可以沒有 width/height
- ✅ amenities 正確儲存為 JSON

---

## 🚀 測試

1. **建立房源**
   - 訪問: http://localhost:3000/create
   - 填寫表單（某些欄位可以留空）
   - 上傳圖片
   - 提交

2. **檢查結果**
   - 應該能成功建立
   - 查看房源詳情頁面
   - 確認資料正確儲存

---

## 📚 參考

- [Prisma Null vs Undefined](https://www.prisma.io/docs/concepts/components/prisma-client/null-and-undefined)
- [TypeScript Nullish Coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)





