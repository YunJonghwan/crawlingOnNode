import axios from 'axios';
import { ALPHABET, ITEMSARR } from './item.js';

async function fetchByLetter(category, to, from) {
  try {
    const res = await axios.get(`https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3A${category}%20Blocks&gcmlimit=500&gcmstartsortkeyprefix=${to}&gcmendsortkeyprefix=${from}`);
    const dataArray = res.data.query.pages;
    ITEMSARR.push(dataArray);
  } catch (error) {
    console.log(error);
  }
}

async function fetchAllAlphabet() {
  const promise = ALPHABET.slice(0, -1).map((alphabet, index) => fetchByLetter("Foreground", alphabet, alphabet[index + 1]));
  const result = await Promise.allSettled(promise);
  console.log(result);
}

fetchAllAlphabet();