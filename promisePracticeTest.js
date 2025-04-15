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
  for(const key in CATEGORY ) {
    await testFetch(CATEGORY[key], "A", "B");
  }
  console.log(ITEMSARR);
  console.log(ITEMSARR.block.length);
  console.log(ITEMSARR.backGround.length);
}

test();