/**
 * 台灣縣市與行政區資料
 */

export interface District {
  name: string;
  zipCode: string;
}

export interface City {
  name: string;
  districts: District[];
}

export const TAIWAN_CITIES: City[] = [
  {
    name: '台北市',
    districts: [
      { name: '中正區', zipCode: '100' },
      { name: '大同區', zipCode: '103' },
      { name: '中山區', zipCode: '104' },
      { name: '松山區', zipCode: '105' },
      { name: '大安區', zipCode: '106' },
      { name: '萬華區', zipCode: '108' },
      { name: '信義區', zipCode: '110' },
      { name: '士林區', zipCode: '111' },
      { name: '北投區', zipCode: '112' },
      { name: '內湖區', zipCode: '114' },
      { name: '南港區', zipCode: '115' },
      { name: '文山區', zipCode: '116' },
    ],
  },
  {
    name: '新北市',
    districts: [
      { name: '板橋區', zipCode: '220' },
      { name: '新莊區', zipCode: '242' },
      { name: '中和區', zipCode: '235' },
      { name: '永和區', zipCode: '234' },
      { name: '土城區', zipCode: '236' },
      { name: '樹林區', zipCode: '238' },
      { name: '三峽區', zipCode: '237' },
      { name: '鶯歌區', zipCode: '239' },
      { name: '三重區', zipCode: '241' },
      { name: '蘆洲區', zipCode: '247' },
      { name: '五股區', zipCode: '248' },
      { name: '泰山區', zipCode: '243' },
      { name: '林口區', zipCode: '244' },
      { name: '淡水區', zipCode: '251' },
      { name: '汐止區', zipCode: '221' },
      { name: '新店區', zipCode: '231' },
      { name: '深坑區', zipCode: '222' },
      { name: '石碇區', zipCode: '223' },
      { name: '坪林區', zipCode: '232' },
      { name: '烏來區', zipCode: '233' },
    ],
  },
  {
    name: '桃園市',
    districts: [
      { name: '桃園區', zipCode: '330' },
      { name: '中壢區', zipCode: '320' },
      { name: '平鎮區', zipCode: '324' },
      { name: '八德區', zipCode: '334' },
      { name: '楊梅區', zipCode: '326' },
      { name: '蘆竹區', zipCode: '338' },
      { name: '大溪區', zipCode: '335' },
      { name: '龍潭區', zipCode: '325' },
      { name: '龜山區', zipCode: '333' },
      { name: '大園區', zipCode: '337' },
      { name: '觀音區', zipCode: '328' },
      { name: '新屋區', zipCode: '327' },
      { name: '復興區', zipCode: '336' },
    ],
  },
  {
    name: '台中市',
    districts: [
      { name: '中區', zipCode: '400' },
      { name: '東區', zipCode: '401' },
      { name: '南區', zipCode: '402' },
      { name: '西區', zipCode: '403' },
      { name: '北區', zipCode: '404' },
      { name: '北屯區', zipCode: '406' },
      { name: '西屯區', zipCode: '407' },
      { name: '南屯區', zipCode: '408' },
      { name: '太平區', zipCode: '411' },
      { name: '大里區', zipCode: '412' },
      { name: '霧峰區', zipCode: '413' },
      { name: '烏日區', zipCode: '414' },
      { name: '豐原區', zipCode: '420' },
      { name: '后里區', zipCode: '421' },
      { name: '石岡區', zipCode: '422' },
      { name: '東勢區', zipCode: '423' },
      { name: '和平區', zipCode: '424' },
      { name: '新社區', zipCode: '426' },
      { name: '潭子區', zipCode: '427' },
      { name: '大雅區', zipCode: '428' },
      { name: '神岡區', zipCode: '429' },
      { name: '大肚區', zipCode: '432' },
      { name: '沙鹿區', zipCode: '433' },
      { name: '龍井區', zipCode: '434' },
      { name: '梧棲區', zipCode: '435' },
      { name: '清水區', zipCode: '436' },
      { name: '大甲區', zipCode: '437' },
      { name: '外埔區', zipCode: '438' },
      { name: '大安區', zipCode: '439' },
    ],
  },
  {
    name: '台南市',
    districts: [
      { name: '中西區', zipCode: '700' },
      { name: '東區', zipCode: '701' },
      { name: '南區', zipCode: '702' },
      { name: '北區', zipCode: '704' },
      { name: '安平區', zipCode: '708' },
      { name: '安南區', zipCode: '709' },
      { name: '永康區', zipCode: '710' },
      { name: '歸仁區', zipCode: '711' },
      { name: '新化區', zipCode: '712' },
      { name: '左鎮區', zipCode: '713' },
      { name: '玉井區', zipCode: '714' },
      { name: '楠西區', zipCode: '715' },
      { name: '南化區', zipCode: '716' },
      { name: '仁德區', zipCode: '717' },
      { name: '關廟區', zipCode: '718' },
      { name: '龍崎區', zipCode: '719' },
      { name: '官田區', zipCode: '720' },
      { name: '麻豆區', zipCode: '721' },
      { name: '佳里區', zipCode: '722' },
      { name: '西港區', zipCode: '723' },
      { name: '七股區', zipCode: '724' },
      { name: '將軍區', zipCode: '725' },
      { name: '學甲區', zipCode: '726' },
      { name: '北門區', zipCode: '727' },
      { name: '新營區', zipCode: '730' },
      { name: '後壁區', zipCode: '731' },
      { name: '白河區', zipCode: '732' },
      { name: '東山區', zipCode: '733' },
      { name: '六甲區', zipCode: '734' },
      { name: '下營區', zipCode: '735' },
      { name: '柳營區', zipCode: '736' },
      { name: '鹽水區', zipCode: '737' },
      { name: '善化區', zipCode: '741' },
      { name: '大內區', zipCode: '742' },
      { name: '山上區', zipCode: '743' },
      { name: '新市區', zipCode: '744' },
      { name: '安定區', zipCode: '745' },
    ],
  },
  {
    name: '高雄市',
    districts: [
      { name: '新興區', zipCode: '800' },
      { name: '前金區', zipCode: '801' },
      { name: '苓雅區', zipCode: '802' },
      { name: '鹽埕區', zipCode: '803' },
      { name: '鼓山區', zipCode: '804' },
      { name: '旗津區', zipCode: '805' },
      { name: '前鎮區', zipCode: '806' },
      { name: '三民區', zipCode: '807' },
      { name: '楠梓區', zipCode: '811' },
      { name: '小港區', zipCode: '812' },
      { name: '左營區', zipCode: '813' },
      { name: '仁武區', zipCode: '814' },
      { name: '大社區', zipCode: '815' },
      { name: '東沙群島', zipCode: '817' },
      { name: '南沙群島', zipCode: '819' },
      { name: '岡山區', zipCode: '820' },
      { name: '路竹區', zipCode: '821' },
      { name: '阿蓮區', zipCode: '822' },
      { name: '田寮區', zipCode: '823' },
      { name: '燕巢區', zipCode: '824' },
      { name: '橋頭區', zipCode: '825' },
      { name: '梓官區', zipCode: '826' },
      { name: '彌陀區', zipCode: '827' },
      { name: '永安區', zipCode: '828' },
      { name: '湖內區', zipCode: '829' },
      { name: '鳳山區', zipCode: '830' },
      { name: '大寮區', zipCode: '831' },
      { name: '林園區', zipCode: '832' },
      { name: '鳥松區', zipCode: '833' },
      { name: '大樹區', zipCode: '840' },
      { name: '旗山區', zipCode: '842' },
      { name: '美濃區', zipCode: '843' },
      { name: '六龜區', zipCode: '844' },
      { name: '內門區', zipCode: '845' },
      { name: '杉林區', zipCode: '846' },
      { name: '甲仙區', zipCode: '847' },
      { name: '桃源區', zipCode: '848' },
      { name: '那瑪夏區', zipCode: '849' },
      { name: '茂林區', zipCode: '851' },
      { name: '茄萣區', zipCode: '852' },
    ],
  },
];

// 取得所有縣市名稱
export const CITY_NAMES = TAIWAN_CITIES.map((city) => city.name);

// 根據縣市名稱取得行政區
export const getDistrictsByCity = (cityName: string): District[] => {
  const city = TAIWAN_CITIES.find((c) => c.name === cityName);
  return city?.districts || [];
};

// 根據縣市名稱取得行政區名稱
export const getDistrictNamesByCity = (cityName: string): string[] => {
  const districts = getDistrictsByCity(cityName);
  return districts.map((d) => d.name);
};
