const axios = require("axios");
const cheerio = require("cheerio");

const { ITEMSARR, CATEGORY, ALPHABET } = require("./item.js")

let itemsArr = [];

async function getImage(url) {
  const res = await axios.get(`https://growtopia.fandom.com${url}`);
  const $ = cheerio.load(res.data);
  const imgList = $('.growsprite').children()[0].attribs.src;
  return new Promise((resolve) => {
    resolve(imgList)
  });
}

// async function getUrl() {
//   const res = await axios.get('https://growtopia.fandom.com/wiki/Category:Foreground_Blocks?from=A');
//   const $ = cheerio.load(res.data);
//   const urlList = $('.category-page__member-link');
//   Object.values(urlList).forEach(async (data) => {
//     try {
//       const url = data.attribs.href;
//       const name = data.children[0].data;
//       const image = await getImage(url);
//       const item = new Items(name, url, image);
//       itemsArr.push(item);
//     } catch (error) {
//       return null
//     }
//   });
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(itemsArr);
//     }, 2000)
//   });
// }

// async function test() {
//   let arr = []
//   arr = await getUrl();
//   console.log(itemsArr);
//   console.log(itemsArr.length);
// }

async function getApi(category, to, from) {
  try {
    const res = await axios.get(`https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3A${category}%20Blocks&gcmlimit=500&gcmstartsortkeyprefix=${to}&gcmendsortkeyprefix=${from}`);
    const dataArray = res.data.query.pages;
    // console.log(dataArray);
    Array.from(dataArray).forEach((data) => {
      // console.log(data);
      const itemsObj = {}
      itemsObj.title = data.title;
      itemsObj.category = category;
      if(category === CATEGORY.block) {
        ITEMSARR.block.push(itemsObj);
      }else {
        ITEMSARR.backGround.push(itemsObj);
      }
      console.log(ITEMSARR);
    })
  } catch (error) {
    console.log(new Error(error));
  }
  // console.log(ITEMSARR);
  // return new Promise((resolve) => {
  //   resolve(ITEMSARR);
  // })
}

getApi(CATEGORY.backGround, "A", "B");
getApi(CATEGORY.block, "A", "B");

// async function getData() {
//   let arr;
//   Object.values(CATEGORY).forEach(async (category) => {
//     for (let i = 0; i < ALPHABET.length; i++) {
//       console.log(ALPHABET[i + 1]);
//       arr = await getApi(category, ALPHABET[i], ALPHABET[i + 1]);
//     }
//     console.log(ITEMSARR)
//   })
// }

// getData();