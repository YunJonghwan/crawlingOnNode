import axios from 'axios';
import { ALPHABET, ITEMSARR, CATEGORY } from './item copy.js';

async function fetchByLetter(category, to, from) {
  try {
    const res = await axios.get(`https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3A${category}%20Blocks&gcmlimit=500&gcmstartsortkeyprefix=${to}&gcmendsortkeyprefix=${from}`);
    const dataArray = res.data.query.pages;
    dataArray.forEach(async (data) => {
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

async function fetchAllAlphabet() {
  // const block = ALPHABET.slice(0, -1).map((alphabet, index) => fetchByLetter(CATEGORY.block, alphabet, alphabet[index + 1]));
  const backGround = ALPHABET.slice(0, -1).map((alphabet, index) => fetchByLetter(CATEGORY.backGround, alphabet, alphabet[index + 1]));

  await Promise.allSettled(backGround);
  console.log(ITEMSARR.block);
  console.log(ITEMSARR.backGround);
  console.log(ITEMSARR.block.length);
  console.log(ITEMSARR.backGround.length);
}

fetchAllAlphabet();