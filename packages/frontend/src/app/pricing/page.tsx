'use client';

import {
  CheckCircleIcon,
  StarIcon,
  SparklesIcon,
  BanknotesIcon,
  ClockIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  FireIcon,
  GiftIcon,
  ShieldCheckIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  TruckIcon,
  TagIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header - 藍色質感 */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <BanknotesIcon className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
              <h1 className="text-4xl md:text-5xl font-bold">收費標準</h1>
              <SparklesIcon className="w-10 h-10 md:w-12 md:h-12 text-yellow-300" />
            </div>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              透明公開的收費標準，讓您清楚了解各項服務費用
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* 出租 - 住宅類單筆刊登 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
            <HomeIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              出租收費標準 - 住宅類
            </h2>
          </div>

          {/* 單筆刊登 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <StarIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                    單筆刊登（推薦屋主使用）
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">適用：整層住家、獨立套房、分租套房、雅房、車位</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="px-4 py-4 text-left font-bold text-blue-900 border-b-2 border-blue-200">服務說明</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">普通廣告</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>超級VIP廣告</span>
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">推薦</span>
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>黃金曝光廣告</span>
                          <FireIcon className="w-5 h-5 text-orange-500" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">單價</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-2xl font-bold text-blue-600">400</span>
                        <span className="text-gray-600 ml-1">元</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">789</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">原價1,000元</div>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">1,289</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">原價2,500元</div>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">首頁、列表頁 &quot;為您精選&quot; 區</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">手機端優先排序，搶80%房客</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">始終排在普通廣告前</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">始終排在列表最前</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">電腦端優先排序，搶20%房客</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">定時更新排序，讓您的廣告更靠前</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center text-blue-600 font-semibold">5次/天</td>
                      <td className="px-4 py-3 text-center text-blue-600 font-semibold bg-gradient-to-r from-yellow-50/30 to-orange-50/30">8次/天</td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">[優選好屋]入選加權</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">擁有醒目標識</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">問答簡訊</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">享APP精準推播</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">72小時內無理由修改</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">24小時內極速退點</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b-2 border-blue-200">
                      <td className="px-4 py-4 font-semibold text-gray-700">刊登時間</td>
                      <td className="px-4 py-4 text-center text-gray-600">30天</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">30天</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">30天</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <td className="px-4 py-4 font-semibold text-gray-700">平均點閱量</td>
                      <td className="px-4 py-4 text-center text-gray-500">—</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-green-600">提升250%</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-green-600">提升450%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* 住宅類套餐 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <GiftIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                    多筆優惠刊登（推薦仲介使用）
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">適用：整層住家、獨立套房、分租套房、雅房、車位</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="px-4 py-4 text-left font-bold text-blue-900 border-b-2 border-blue-200">套餐類型</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">新手套餐</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">普通套餐</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>超級套餐</span>
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">最划算</span>
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>黃金套餐</span>
                          <FireIcon className="w-5 h-5 text-orange-500" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">低至折扣</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">5.3折</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">5.3折</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <span className="text-lg font-bold text-blue-600">5.3折</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <span className="text-lg font-bold text-blue-600">5.3折</span>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-4 font-semibold text-gray-700">售價</td>
                      <td className="px-4 py-4 text-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">540</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">(原價900元)</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">1,080</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">(原價1,800元)</div>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">2,080</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">(原價3,600元)</div>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">3,980</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">(原價7,500元)</div>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告數量</td>
                      <td className="px-4 py-4 text-center text-gray-600">3筆</td>
                      <td className="px-4 py-4 text-center text-gray-600">6筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">12筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">25筆</td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-4 font-semibold text-gray-700">更換次數</td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold">可無限次更換物件</td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold">可無限次更換物件</td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold bg-gradient-to-r from-yellow-50/30 to-orange-50/30">可無限次更換物件</td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold bg-gradient-to-r from-yellow-50/30 to-orange-50/30">可無限次更換物件</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告單價</td>
                      <td className="px-4 py-4 text-center text-gray-600">180元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600">180元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">173元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">159元/筆</td>
                    </tr>
                    <tr className="border-b-2 border-blue-200">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告時間</td>
                      <td className="px-4 py-4 text-center text-gray-600">30天</td>
                      <td className="px-4 py-4 text-center text-gray-600">30天</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">30天</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">30天</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">※ 套餐有效時間：</p>
                    <p className="text-sm text-amber-800">購買之日起30天內有效，套餐中的物件需在有效期內使用完，逾期作廢。</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 出租 - 商用類套餐 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
            <BuildingStorefrontIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              出租收費標準 - 商用類
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BuildingOfficeIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                    多筆優惠刊登（推薦仲介使用）
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">適用：店面、頂讓、辦公、住辦、土地、廠房</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="px-4 py-4 text-left font-bold text-blue-900 border-b-2 border-blue-200">套餐類型</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">新手套餐</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">普通套餐</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>超級套餐</span>
                          <FireIcon className="w-5 h-5 text-orange-500" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">低至折扣</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">5折</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">5折</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <span className="text-lg font-bold text-blue-600">5折</span>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-4 font-semibold text-gray-700">售價</td>
                      <td className="px-4 py-4 text-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">1,200</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">(原價1,800元)</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">2,200</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">(原價3,600元)</div>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">3,580</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">(原價7,200元)</div>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告數量</td>
                      <td className="px-4 py-4 text-center text-gray-600">3筆</td>
                      <td className="px-4 py-4 text-center text-gray-600">6筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">12筆</td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-4 font-semibold text-gray-700">更換次數</td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold">可無限次更換物件</td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold">可無限次更換物件</td>
                      <td className="px-4 py-4 text-center text-blue-600 font-semibold bg-gradient-to-r from-yellow-50/30 to-orange-50/30">可無限次更換物件</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告單價</td>
                      <td className="px-4 py-4 text-center text-gray-600">400元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600">366元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">298元/筆</td>
                    </tr>
                    <tr className="border-b-2 border-blue-200">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告時間</td>
                      <td className="px-4 py-4 text-center text-gray-600">90天</td>
                      <td className="px-4 py-4 text-center text-gray-600">90天</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">90天</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 加值服務 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
            <SparklesIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              加值服務收費標準
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* 電腦版加值服務 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <ComputerDesktopIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">電腦版加值服務</h3>
              </div>
              <div className="space-y-4">
                {[
                  { type: '定時更新', price: 150, time: '15天', increase: '25%', desc: '系統每天自動幫你更新，省時省力。', count: '158711' },
                  { type: '加急標籤', price: 150, time: '30天', increase: '85%', desc: '專屬急租列表，獲得更多瀏覽量。', count: '42504' },
                  { type: '精選推薦', price: 1500, time: '30天', increase: '280%', desc: '物件列表及推薦區雙重曝光，捕獲網友的第一眼球。', count: '368792', featured: true },
                ].map((service, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${service.featured ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300' : 'bg-white border-blue-200'} hover:border-blue-400 transition-all`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-blue-900">{service.type}</h4>
                          {service.featured && <StarIcon className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{service.desc}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-blue-600">{service.price}元</div>
                        <div className="text-xs text-gray-500">{service.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                      <span className="text-xs text-gray-500">已有{service.count}人購買</span>
                      <span className="text-sm font-semibold text-green-600">提高{service.increase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 移動版加值服務 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-200"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">移動版加值服務</h3>
              </div>
              <div className="space-y-4">
                {[
                  { type: '行動版置頂', price: 400, time: '30天', increase: '150%', desc: '物件固定排在一般物件前，並帶醒目"頂"標籤。', count: '1093459' },
                  { type: '行動版精選推薦', price: 1500, time: '30天', increase: '280%', desc: '物件固定排在列表頁頂部6個廣告，並帶醒目"頂"標籤。', count: '155722', featured: true },
                ].map((service, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 ${service.featured ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300' : 'bg-white border-blue-200'} hover:border-blue-400 transition-all`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-blue-900">{service.type}</h4>
                          {service.featured && <StarIcon className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{service.desc}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-xl font-bold text-blue-600">{service.price}元</div>
                        <div className="text-xs text-gray-500">{service.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-100">
                      <span className="text-xs text-gray-500">已有{service.count}人購買</span>
                      <span className="text-sm font-semibold text-green-600">提高{service.increase}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 出售收費標準 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
            <ChartBarIcon className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
              出售收費標準
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <StarIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                    單筆刊登（推薦屋主使用）
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">適用：住宅、套房、車位、店面、辦公、廠房、土地</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="px-4 py-4 text-left font-bold text-blue-900 border-b-2 border-blue-200">服務說明</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">普通廣告</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>VIP廣告</span>
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">推薦</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">單價</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-2xl font-bold text-blue-600">600</span>
                        <span className="text-gray-600 ml-1">元</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <span className="text-2xl font-bold text-blue-600">1,500</span>
                        <span className="text-gray-600 ml-1">元</span>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">首頁曝光</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">加強曝光</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">定時更新</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center text-blue-600 font-semibold bg-gradient-to-r from-yellow-50/30 to-orange-50/30">5次</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-3 text-sm text-gray-700">置頂</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center text-blue-600 font-semibold bg-gradient-to-r from-yellow-50/30 to-orange-50/30">排在普通廣告前面</td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-3 text-sm text-gray-700">問答簡訊</td>
                      <td className="px-4 py-3 text-center text-gray-500">—</td>
                      <td className="px-4 py-3 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b-2 border-blue-200">
                      <td className="px-4 py-4 font-semibold text-gray-700">刊登時間</td>
                      <td className="px-4 py-4 text-center text-gray-600">90天</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">90天</td>
                    </tr>
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <td className="px-4 py-4 font-semibold text-gray-700">平均點閱量</td>
                      <td className="px-4 py-4 text-center text-gray-500">—</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-green-600">提高80%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* 出售多筆套餐 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <GiftIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900">
                    多筆套餐（推薦仲介使用）
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">低至7折優惠</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                      <th className="px-4 py-4 text-left font-bold text-blue-900 border-b-2 border-blue-200">套餐類型</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">新手套餐</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200">普通套餐</th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>超級套餐</span>
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">最划算</span>
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center font-bold text-blue-900 border-b-2 border-blue-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="flex items-center justify-center gap-2">
                          <span>黃金套餐</span>
                          <FireIcon className="w-5 h-5 text-orange-500" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">低至折扣</td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">7折</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">7折</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <span className="text-lg font-bold text-blue-600">7折</span>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <span className="text-lg font-bold text-blue-600">7折</span>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-4 font-semibold text-gray-700">售價</td>
                      <td className="px-4 py-4 text-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">1,200</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">2,200</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">原價2,400元</div>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">5,200</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">原價6,400元</div>
                      </td>
                      <td className="px-4 py-4 text-center bg-gradient-to-r from-yellow-50/30 to-orange-50/30">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">9,800</span>
                          <span className="text-gray-600 ml-1">元</span>
                        </div>
                        <div className="text-xs text-gray-500 line-through mt-1">原價14,400元</div>
                      </td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告數量</td>
                      <td className="px-4 py-4 text-center text-gray-600">3筆</td>
                      <td className="px-4 py-4 text-center text-gray-600">6筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">16筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">35筆</td>
                    </tr>
                    <tr className="border-b border-blue-100 bg-blue-50/30">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告單價</td>
                      <td className="px-4 py-4 text-center text-gray-600">400元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600">366元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">325元/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">280元/筆</td>
                    </tr>
                    <tr className="border-b-2 border-blue-200">
                      <td className="px-4 py-4 font-semibold text-gray-700">廣告時間</td>
                      <td className="px-4 py-4 text-center text-gray-600">60天/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600">60天/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">60天/筆</td>
                      <td className="px-4 py-4 text-center text-gray-600 bg-gradient-to-r from-yellow-50/30 to-orange-50/30">60天/筆</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 mb-1">※ 套餐有效時間：</p>
                    <p className="text-sm text-amber-800">購買之日起60天內有效，套餐中的物件需在有效期內使用完，逾期作廢。</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <SparklesIcon className="w-8 h-8 text-yellow-300" />
                <h2 className="text-3xl md:text-4xl font-bold">準備開始刊登房源了嗎？</h2>
                <StarIcon className="w-8 h-8 text-yellow-300" />
              </div>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                選擇適合的方案，讓您的房源獲得更多曝光
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/pricing/select"
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl text-lg"
                >
                  ✨ 選擇方案
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 bg-blue-400/80 text-white font-bold rounded-xl hover:bg-blue-400 transition-colors border-2 border-white/30 text-lg"
                >
                  📞 聯絡我們
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
