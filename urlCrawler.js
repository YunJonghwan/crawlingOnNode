const axios = require("axios");
const cheerio = require("cheerio");

async function getUrl() {
  let arr = []
  const res = await axios.get('https://growtopia.fandom.com/wiki/Category:Foreground_Blocks');
  const $ = cheerio.load(res.data);
  const urlList = $('.category-page__member-link');
  Object.values(urlList).forEach((data) => {
    try {
      arr.push(data.attribs.href);
    } catch (error) {
      return null
    }
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(arr);
    }, 1000)
  });
}

async function test() {
  let arr = []
  arr = await getUrl();
  console.log(arr);
}

test();