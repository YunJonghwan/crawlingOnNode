const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');
const { ITEMSARR, CATEGORY, ALPHABET } = require("./item copy.js")

//todo return값에 timeout으로 값을 받아오는 시간을 늘려야 할듯
//todo 현재 블럭:2249 배경:316 개수가 일치하지 않음

async function getApi(category, to, from) {
  try {
    const res = await axios.get(`https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3A${category}%20Blocks&gcmlimit=500&gcmstartsortkeyprefix=${to}&gcmendsortkeyprefix=${from}`);
    const dataArray = res.data.query.pages;
    Array.from(dataArray).forEach(async (data) => {
      const itemsObj = {}
      itemsObj.title = data.title;
      itemsObj.category = category;
      itemsObj.image = await getImage(data.title);
      if(category === CATEGORY.block) {
        ITEMSARR.block.push(itemsObj);
      }else {
        ITEMSARR.backGround.push(itemsObj);
      }
    })
  } catch (error) {
    console.log(Error(error));
  }
}

// getApi(CATEGORY.backGround, "A", "B");
// getApi(CATEGORY.block, "A", "B");

async function getData() {
  Object.values(CATEGORY).forEach(async (category) => {
    for (let i = 0; i < ALPHABET.length; i++) {
      await getApi(category, ALPHABET[i], ALPHABET[i + 1]);
    }
    console.log(ITEMSARR);
    console.log(ITEMSARR.block.length, "블럭 길이");
    console.log(ITEMSARR.backGround.length, "배경 길이");
  })
}

async function getImage(url) {
  try {
    const res = await axios.get(`https://growtopia.fandom.com/wiki/${url}`);
    const $ = cheerio.load(res.data);
    const imgList = $('.growsprite').children()[0].attribs.src;
    return new Promise((resolve) => {
        resolve(imgList);
    });
  } catch (error) {
    console.error(error);
  }

}

getData();