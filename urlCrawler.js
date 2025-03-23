const axios = require("axios");
const cheerio = require("cheerio");

const getHtmlUrlList = axios.get('https://growtopia.fandom.com/wiki/Category:Foreground_Blocks');
getHtmlUrlList.then(html => {
  const $ = cheerio.load(html.data);
  const urlList = $('.category-page__member-link');
  
  Object.values(urlList).forEach(data => {
    try {
      console.log(data.attribs.href);
      return data.attribs.href;
    } catch (error) {
      return null
    }
  })
})