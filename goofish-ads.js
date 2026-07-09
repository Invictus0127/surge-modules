const url = $request.url;
let obj;

try {
  obj = JSON.parse($response.body);
} catch {
  $done({});
}

const data = obj.data || {};

function keepItems(list) {
  return Array.isArray(list)
    ? list.filter((item) => item?.data?.bizType === "item")
    : list;
}

if (/mtop\.taobao\.idle\.user\.strategy\.list/.test(url)) {
  data.strategies = [{}];
}

if (/mtop\.taobao\.idlehome\.home\.circle\.list/.test(url)) {
  data.circleList = Array.isArray(data.circleList)
    ? data.circleList.filter((item) => item?.bizCode !== "saveMoney")
    : data.circleList;
}

if (/mtop\.taobao\.idlehome\.home\.nextfresh/.test(url)) {
  if (Array.isArray(data.homeTopList)) data.homeTopList = data.homeTopList.slice(0, 1);
  data.sections = keepItems(data.sections);
}

if (/mtop\.taobao\.idlemtopsearch\.search\.shade/.test(url)) {
  data.singleShadeWords = [{}];
}

if (/mtop\.taobao\.idlemtopsearch\.item\.search\.activate/.test(url)) {
  data.cardList = [{}];
}

if (/mtop\.taobao\.idlemtopsearch\.search\.discover/.test(url)) {
  delete data.resultList;
}

if (/mtop\.idle\.user\.page\.my\.adapter/.test(url)) {
  data.ability = [];
  if (data.container && Array.isArray(data.container.sections)) {
    data.container.sections = data.container.sections.filter((item) =>
      /head|user|trade/.test(item?.sectionBizCode || "")
    );
  }
}

if (/mtop\.taobao\.idle\.item\.buy\.feeds/.test(url)) {
  delete data.sections;
}

if (/mtop\.taobao\.idle\.local\.home/.test(url)) {
  data.sections = keepItems(data.sections);
}

if (/mtop\.taobao\.idlemtopsearch\.search(\/|\?|$)/.test(url)) {
  data.resultList = Array.isArray(data.resultList)
    ? data.resultList.filter((item) => item?.data?.item?.main?.clickParam?.args?.biz_type === "item")
    : data.resultList;
}

if (/mtop\.taobao\.idle\.item\.recommend/.test(url)) {
  data.cardList = Array.isArray(data.cardList)
    ? data.cardList.filter((item) => item?.cardData?.bizType !== "mamaAD")
    : data.cardList;
}

obj.data = data;
$done({ body: JSON.stringify(obj) });
