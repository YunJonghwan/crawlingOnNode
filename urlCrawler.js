const axios = require("axios");
const cheerio = require("cheerio");

const { Items, ITEMSARR } = require('./item');

async function getImage(url) {
  const res = await axios.get(`https://growtopia.fandom.com${url}`);
  const $ = cheerio.load(res.data);
  const imgList = $('.growsprite').children()[0].attribs.src;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(imgList)
    }, 100);
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
      ITEMSARR.push(item);
    } catch (error) {
      return null
    }
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ITEMSARR);
    }, 2000)
  });
}

async function test() {
  let arr = []
  arr = await getUrl();
  console.log(ITEMSARR);
  console.log(ITEMSARR.length);
}

test();