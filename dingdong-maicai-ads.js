let obj;

try {
  obj = JSON.parse($response.body);
} catch {
  $done({});
}

const keyBlock = /(^|_)(ad|ads|advert|advertise|advertisement|splash|popup|pop_up|pop|launch|startup|float|floating|redpacket|red_packet|bubble|guide|interstitial|open_screen|openscreen)(_|$)/i;
const nameBlock = /(广告|开屏|弹窗|浮层|浮窗|推荐弹层|营销弹窗|新人弹窗|开屏页|启动页|运营位|活动浮层)/;
const sceneBlock = /(splash|startup|launch|ad|advert|popup|float|interstitial|openScreen|open_screen)/i;

const preserveKeys = new Set([
  "address",
  "cart",
  "order",
  "orders",
  "payment",
  "pay",
  "sku",
  "spu",
  "goods",
  "product",
  "products",
  "coupon",
  "coupons",
  "voucher",
  "price",
  "stock",
  "delivery",
  "invoice"
]);

function shouldDropKey(key) {
  if (!key) return false;
  const normalized = String(key).replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`).toLowerCase();
  if (preserveKeys.has(normalized)) return false;
  return keyBlock.test(normalized);
}

function textOf(value) {
  if (!value || typeof value !== "object") return "";
  const keys = ["type", "scene", "bizType", "biz_type", "position", "code", "name", "title", "desc", "content"];
  return keys.map((key) => value[key]).filter((item) => typeof item === "string").join(" ");
}

function shouldDropItem(item) {
  if (!item || typeof item !== "object") return false;
  const text = textOf(item);
  if (sceneBlock.test(text) || nameBlock.test(text)) return true;
  return Object.keys(item).some((key) => shouldDropKey(key) && !preserveKeys.has(key.toLowerCase()));
}

function shouldDropObject(value) {
  if (!value || typeof value !== "object") return false;
  const text = textOf(value);
  return sceneBlock.test(text) || nameBlock.test(text);
}

function clean(value, parentKey = "") {
  if (Array.isArray(value)) {
    if (shouldDropKey(parentKey)) return [];
    return value
      .filter((item) => !shouldDropItem(item))
      .map((item) => clean(item, parentKey));
  }

  if (!value || typeof value !== "object") return value;

  for (const key of Object.keys(value)) {
    if (shouldDropKey(key)) {
      if (Array.isArray(value[key])) value[key] = [];
      else if (value[key] && typeof value[key] === "object") value[key] = {};
      else if (typeof value[key] === "boolean") value[key] = false;
      else if (typeof value[key] === "number") value[key] = 0;
      else value[key] = "";
      continue;
    }

    if (shouldDropObject(value[key])) {
      delete value[key];
      continue;
    }

    value[key] = clean(value[key], key);
  }

  return value;
}

$done({ body: JSON.stringify(clean(obj)) });
