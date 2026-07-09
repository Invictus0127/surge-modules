const url = $request.url;
let obj;
let canClean = true;

try {
  obj = JSON.parse($response.body);
} catch {
  canClean = false;
}

if (!canClean) {
  $done({});
} else {
const keyBlock = /(^|_)(ad|ads|advert|advertise|advertisement|splash|popup|pop_up|pop|launch|startup|float|floating|redpacket|red_packet|bubble|guide|interstitial|open_screen|openscreen|recall|hesitate|material|materials|marketing|promotion|operate|operation|activity|resource|resources|dialog|window|layer|toast|skin|pendant|new_user|newer)(_|$)/i;
const hardKeyBlock = /(^|_)(adv|adverts|splash|splash_screen|popup|pop_up|pop_window|modal|launch|startup|start_up|boot|bootup|cold_start|hot_start|float|floating|redpacket|red_packet|coupon_pop|bubble|guide|interstitial|open_screen|openscreen|full_screen|fullscreen|recall|hesitate|material|materials|marketing|promotion|promote|commercial|commercialize|operate|operation|activity|campaign|resource|resources|dialog|window|layer|toast|skin|pendant|new_user|newer|newbie|newcomer|recommend_layer|exposure|bury|trace)(_|$)/i;
const nameBlock = /(广告|开屏|弹窗|浮层|浮窗|推荐弹层|营销弹窗|新人弹窗|开屏页|启动页|运营位|活动浮层|召回|犹豫|挽留|引导|挂件|皮肤|红包雨|营销|推广|活动|新人|限时|领券|抽奖|签到|曝光)/;
const sceneBlock = /(splash|startup|launch|boot|ad|advert|popup|popUp|float|interstitial|openScreen|open_screen|fullScreen|full_screen|recall|hesitate|marketing|promotion|operation|activity|campaign|pendant|skin|newUser|new_user|newbie|commercial)/i;
const urlBlock = /(splash|startup|launch|boot|open[_-]?screen|full[_-]?screen|advert|advertise|popup|pop[_-]?up|ad[_-]?config|adconf|adzone|marketing|promotion|activity|campaign|recall|hesitate|commercial)/i;
const aggressivePath = /(getLogRecallConfig|hesitateUser\/getRule|degrade\/config|splash|startup|launch|boot|advert|popup|marketing|promotion|activity|campaign|recall|hesitate)/i;
const wholeDomainClean = /(ddxq|dingdongxiaoqu)\.(mobi|com)/i.test(url);

const preserveKeys = new Set([
  "address",
  "cart",
  "carts",
  "order",
  "orders",
  "payment",
  "pay",
  "sku",
  "skus",
  "spu",
  "spus",
  "goods",
  "good",
  "product",
  "products",
  "coupon",
  "coupons",
  "voucher",
  "price",
  "stock",
  "delivery",
  "invoice",
  "shop",
  "store",
  "station",
  "category",
  "categories",
  "search",
  "keyword",
  "keywords",
  "user",
  "profile",
  "member",
  "account"
]);

const businessItemKeys = new Set([
  "address",
  "cart",
  "carts",
  "order",
  "orders",
  "payment",
  "pay",
  "sku",
  "skus",
  "spu",
  "spus",
  "goods",
  "good",
  "product",
  "products",
  "coupon",
  "coupons",
  "voucher",
  "price",
  "stock",
  "delivery",
  "invoice",
  "shop",
  "store",
  "station",
  "category",
  "categories",
  "search",
  "keyword",
  "keywords",
  "user",
  "profile",
  "member",
  "account"
]);

function normalizeKey(key) {
  return String(key || "")
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    .replace(/[-\s]+/g, "_")
    .toLowerCase();
}

function emptyFor(value) {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return {};
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

function shouldDropKey(key, aggressive = false) {
  const normalized = normalizeKey(key);
  if (!normalized || preserveKeys.has(normalized)) return false;
  if (keyBlock.test(normalized)) return true;
  if (aggressive && hardKeyBlock.test(normalized)) return true;
  if (aggressive && /(config|conf|rule|rules|strategy|strategies|template|templates|display|displayable|show|visible|enable|enabled)/i.test(normalized)) return true;
  return false;
}

function textOf(value) {
  if (!value || typeof value !== "object") return "";
  const keys = [
    "type",
    "scene",
    "bizType",
    "biz_type",
    "position",
    "code",
    "name",
    "title",
    "desc",
    "content",
    "url",
    "jump_url",
    "jumpUrl",
    "schema",
    "scheme",
    "link",
    "link_url",
    "linkUrl",
    "image",
    "image_url",
    "imageUrl",
    "img",
    "imgUrl",
    "pic",
    "pic_url",
    "picUrl"
  ];
  return keys.map((key) => value[key]).filter((item) => typeof item === "string").join(" ");
}

function shouldDropItem(item, aggressive = false) {
  if (!item || typeof item !== "object") return false;
  const keys = Object.keys(item);
  if (keys.some((key) => businessItemKeys.has(normalizeKey(key)))) return false;
  const text = textOf(item);
  if (sceneBlock.test(text) || nameBlock.test(text) || urlBlock.test(text)) return true;
  if (keys.some((key) => shouldDropKey(key, aggressive))) return true;
  if (aggressive && keys.some((key) => /(image|img|pic|schema|scheme|jump|link|url)/i.test(key)) && keys.some((key) => /(title|name|content|desc|button|btn|type|scene)/i.test(key))) return true;
  return false;
}

function clean(value, parentKey = "", aggressive = false) {
  if (Array.isArray(value)) {
    if (shouldDropKey(parentKey, aggressive)) return [];
    return value
      .filter((item) => !shouldDropItem(item, aggressive))
      .map((item) => clean(item, parentKey, aggressive));
  }

  if (!value || typeof value !== "object") return value;

  for (const key of Object.keys(value)) {
    if (shouldDropKey(key, aggressive)) {
      value[key] = emptyFor(value[key]);
      continue;
    }

    if (shouldDropItem(value[key], aggressive)) {
      delete value[key];
      continue;
    }

    value[key] = clean(value[key], key, aggressive);
  }

  return value;
}

function disableConfig(value) {
  if (!value || typeof value !== "object") return value;
  for (const key of Object.keys(value)) {
    const normalized = normalizeKey(key);
    if (/^(enable|enabled|is_enable|is_enabled|switch|show|display|visible|need_show|should_show|valid|open)$/.test(normalized)) {
      value[key] = false;
      continue;
    }
    if (/^(count|times|interval|duration|delay|frequency|freq)$/.test(normalized)) {
      value[key] = 0;
      continue;
    }
    value[key] = clean(value[key], key, true);
  }
  return value;
}

if (/getLogRecallConfig/i.test(url)) {
  obj.data = {};
  obj.result = {};
  obj.content = {};
  obj.config = {};
  obj.data.configs = [];
  obj.data.list = [];
  obj.data.rules = [];
}

if (/hesitateUser\/getRule/i.test(url)) {
  obj.data = {};
  obj.result = {};
  obj.content = {};
  obj.data.rules = [];
  obj.data.ruleList = [];
  obj.data.popup = {};
}

if (/degrade\/config/i.test(url)) {
  obj.data = {};
  obj.result = {};
  obj.content = {};
}

const aggressive = wholeDomainClean || aggressivePath.test(url);
$done({ body: JSON.stringify(clean(obj, "", aggressive)) });
}
