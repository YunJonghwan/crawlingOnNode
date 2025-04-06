const axios = require("axios");
const cheerio = require("cheerio");

let itemsArr = [];

async function getImage(url) {
  const res = await axios.get(`https://growtopia.fandom.com${url}`);
  const $ = cheerio.load(res.data);
  const imgList = $('.growsprite').children()[0].attribs.src;
  return new Promise((resolve) => {
      resolve(imgList)
  });
}

async function getUrl() {
  const res = await axios.get('https://growtopia.fandom.com/wiki/Category:Foreground_Blocks?from=A');
  const $ = cheerio.load(res.data);
  const urlList = $('.category-page__member-link');
  Object.values(urlList).forEach(async (data) => {
    try {
      const url = data.attribs.href;
      const name = data.children[0].data;
      const image = await getImage(url);
      const item = new Items(name, url, image);
      itemsArr.push(item);
    } catch (error) {
      return null
    }
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(itemsArr);
    }, 2000)
  });
}

async function test() {
  let arr = []
  arr = await getUrl();
  console.log(itemsArr);
  console.log(itemsArr.length);
}

async function getApi() {
  const res = await axios.get(`https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3AForeground%20Blocks&gcmlimit=500&gcmstartsortkeyprefix=A&gcmendsortkeyprefix=B`);
  const dataArray = res.data.query.pages;
  let titles;
  Array.from(dataArray).forEach((data) => {
    const itemsObj = {}
    itemsObj.title = data.title;
    itemsArr.push(itemsObj);
  })
  console.log(itemsArr);
}

getApi();