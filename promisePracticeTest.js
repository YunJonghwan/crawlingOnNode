import axios from 'axios';
import * as cheerio from "cheerio";
import { ALPHABET, ITEMSARR, CATEGORY } from './item copy.js';

// 특정 범위의 데이터를 가져오는 함수
async function fetchByRange(category, start, end) {
  try {
    const res = await axios.get(
      `https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3A${category}%20Blocks&gcmlimit=500&gcmstartsortkeyprefix=${start}&gcmendsortkeyprefix=${end}`
    );
    const dataArray = res.data.query.pages || [];
    dataArray.forEach((data) => {
      const itemsObj = {};
      itemsObj.title = data.title;
      itemsObj.category = category;
      if (category === CATEGORY.block) {
        ITEMSARR.block.push(itemsObj);
      } else {
        ITEMSARR.backGround.push(itemsObj);
      }
    });
  } catch (error) {
    console.error(`Error fetching range ${start}-${end} for category ${category}:`, error);
  }
}

// 카테고리별로 데이터를 가져오는 함수
async function fetchCategoryData(category) {
  for (let i = 0; i < ALPHABET.length - 1; i++) {
    const start = ALPHABET[i];
    const end = ALPHABET[i + 1];
    await fetchByRange(category, start, end);
  }
}

// 전체 데이터를 가져오는 함수
async function fetchAllData() {
  for (const categoryKey in CATEGORY) {
    const category = CATEGORY[categoryKey];
    console.log(`Fetching data for category: ${category}`);
    await fetchCategoryData(category);
  }

  // 데이터 수집 완료 후 이미지 가져오기
  for (const item of ITEMSARR.block) {
    item.image = await getImage(item.title);
  }
  for (const item of ITEMSARR.backGround) {
    item.image = await getImage(item.title);
  }

  // 결과 출력
  console.log('ITEMSARR:', ITEMSARR);
  console.log('Block count:', ITEMSARR.block.length);
  console.log('Background count:', ITEMSARR.backGround.length);
}

async function getImage(title) {
  try {
    const url = `https://growtopia.fandom.com/wiki/${title}`;
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    // 이미지 URL 추출
    const imgElement = $('.growsprite').children().first();
    const imgSrc = imgElement.attr('src');
    console.log(`이미지 불러오는 중 : ${title}\n이미지 경로: ${imgSrc}`);
    if (!imgSrc) {
      console.warn(`No image found for title: ${title}`);
      return null;
    }

    return imgSrc;
  } catch (error) {
    console.error(`Error fetching image for title: ${title}`, error);
    return null;
  }
}

fetchAllData();