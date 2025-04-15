import axios from 'axios';
import { ALPHABET, ITEMSARR, CATEGORY } from './item copy.js';

async function testFetch(category, to, from) {
  try {
    const res = await axios.get(`https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3A${category}%20Blocks&gcmlimit=500&gcmstartsortkeyprefix=${to}&gcmendsortkeyprefix=${from}`);
    const dataArray = res.data.query.pages;
    dataArray.forEach((data) => {
      const itemsObj = {}
      itemsObj.title = data.title;
      itemsObj.category = category;
      if(category === CATEGORY.block) {
        ITEMSARR.block.push(itemsObj);
      }else {
        ITEMSARR.backGround.push(itemsObj);
      }
    })
  } catch (error) {
    console.log(error);
  }
}


async function test() {
  //todo 카테고리를 한번에 두지 않고 Block Background를 나눠서 동작하도록 하자
  //todo 한번에 하니깐 for문안에 for문이 되서 너무 복잡해지고 지저분해 지기때문에 나눠서 하기로 함
  console.log(ITEMSARR);
  console.log(ITEMSARR.block.length);
  console.log(ITEMSARR.backGround.length);
}

test();