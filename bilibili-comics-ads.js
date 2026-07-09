const url = $request.url;
let obj;

try {
  obj = JSON.parse($response.body);
} catch {
  $done({});
}

function ensureData() {
  if (!obj.data || typeof obj.data !== "object") obj.data = {};
  return obj.data;
}

if (/Comic\/ListFlash/.test(url)) {
  const data = ensureData();
  data.list = [];
  data.ad_list = [];
  data.show = [];
  data.verifying_list = [];
  data.ad_loc = false;
}

if (/Comic\/Banner/.test(url)) {
  obj.data = [];
}

if (/Comic\/AppInit/.test(url)) {
  const data = ensureData();
  data.flash = {};
  data.operate = {};
  data.user_center_operate = null;
  data.activity_tab = null;
  data.bubble = null;
  data.card_banner_in_pay = null;
  data.card_banner_in_ctrl = { id: 0, img_url: "" };
  data.card_banner_in_coupon = null;
  data.fission = { enable_entry: false, title: "", subtitle: "", url: "" };
  data.shop_entry = false;
  data.shop_entry_txt = "";
  data.shop_entry_icon = "";
  data.game_entry = false;
  data.game_entry_txt = "";
  data.game_entry_desc = "";
  data.game_entry_url = "";
  data.game_entry_icon = "";
  data.act_entry_txt = "";
  data.act_entry_txt_type = 0;
  data.unread_message_count = 0;
}

if (/Comic\/GetClassPageAllTabs/.test(url)) {
  const data = ensureData();
  if (Array.isArray(data.home_type)) {
    data.home_type = data.home_type.filter((item) => item?.name !== "初夏纯爱！" && item?.name !== "妖气村");
  }
  if (Array.isArray(data.home_feed)) {
    data.home_feed = data.home_feed.filter((item) => item?.name !== "商城");
  }
}

if (/Home\/HomeFeed/.test(url)) {
  const data = ensureData();
  if (Array.isArray(data.feeds)) data.feeds = data.feeds.filter((item) => item?.type !== 42);
  if (data.banner && typeof data.banner === "object") {
    data.banner.image = "";
    data.banner.jump_url = "";
    data.banner.text = "";
    data.banner.remain_sign_days = 0;
  }
}

if (/Comic\/GetActivityTab/.test(url)) {
  obj.data = { name: "", img: "", url: "", gif: "", cycle_num: 0, bubble_txt: "", id: 0 };
}

if (/Comic\/GetBubbles/.test(url)) {
  obj.data = { bubbles: [], rule: null };
}

if (/Comic\/GetWelfareBanner/.test(url)) {
  obj.data = { type: 0, title: "", sub_title: "", content: "", jump_url: "" };
}

if (/Comic\/GetOperaterBanner/.test(url)) {
  obj.data = { operate: {} };
}

if (/Comic\/GetCommonBanner/.test(url)) {
  obj.data = {
    id: 0,
    title: "",
    content: "",
    jump_url: "",
    jump_type: 0,
    background: "",
    image_url: "",
    comic_id: 0,
    icon: "",
    type: 0,
    column: null,
    limit_scope: 0,
    btn_txt: "",
    img_type: 0,
    play_mode: 0,
    color_type: 0,
    sub_background: "",
    relate_second_page: false,
    active_time: "",
    offline_time: "",
    create_time: "",
    status: 0,
    banner_ext: null,
    bubble_text: "",
    calendar_ext: null
  };
}

if (/Comic\/GetHookBanner/.test(url)) {
  obj.data = { id: 0, title: "", jump_url: "", image_url: "" };
}

if (/User\/UCenterConf/.test(url)) {
  const data = ensureData();
  if (Array.isArray(data.confs)) data.confs = data.confs.filter((item) => item?.title === "我的已购");
  data.show_welfare = false;
  data.show_all_welfare = false;
}

if (/User\/GetMarketingCenterInfo/.test(url)) {
  obj.data = {
    show_entry: false,
    entry: { image: "", url: "", entry_id: "0" },
    show_popup: false,
    popup: { image: "", url: "", activity_id: "0", entry_id: "0" }
  };
}

if (/Search\/GetSearchBoxKeyword/.test(url)) {
  obj.data = { keywords: [] };
}

if (/Comic\/SearchDisplay/.test(url)) {
  obj.data = { list: [] };
}

if (/Comic\/SearchBanner/.test(url)) {
  obj.data = { banners: [] };
}

if (/Search\/GetGuessLabel/.test(url)) {
  obj.data = { labels: [] };
}

if (/Search\/GetHotSearch/.test(url)) {
  obj.data = { comics: [] };
}

if (/Line\/TabRedDot/.test(url)) {
  obj.data = { has_red_dot: false };
}

if (/Comic\/Recommend/.test(url)) {
  obj.data = [];
}

$done({ body: JSON.stringify(obj) });
