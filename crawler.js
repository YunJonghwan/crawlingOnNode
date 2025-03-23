const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = axios.get("https://growtopia.fandom.com/wiki/Dirt");
getHtml.then(html => {
  const $ = cheerio.load(html.data);
  console.log($('.growsprite').children()[0].attribs);
})
