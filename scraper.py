# scraper.py
import scrapy
from scrapy.crawler import CrawlerProcess
import json
import os

# 상수 정의
ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
CATEGORY = {
    'block': 'Block',
    'backGround': 'Background'
}

class GrowtopiaCrawler(scrapy.Spider):
    name = 'growtopia_crawler'
    allowed_domains = ['growtopia.fandom.com']
    
    def __init__(self, *args, **kwargs):
        super(GrowtopiaCrawler, self).__init__(*args, **kwargs)
        self.items_arr = {
            'block': [],
            'backGround': []
        }
        self.processed_items = 0
        self.total_items = 0

    def start_requests(self):
        # 각 카테고리별 알파벳 범위로 요청 생성
        for category_key, category in CATEGORY.items():
            for i in range(len(ALPHABET) - 1):
                start = ALPHABET[i]
                end = ALPHABET[i + 1]
                url = f"https://growtopia.fandom.com/api.php?action=query&format=json&prop=&titles=&generator=categorymembers&formatversion=2&gcmtitle=Category%3A{category}%20Blocks&gcmlimit=500&gcmstartsortkeyprefix={start}&gcmendsortkeyprefix={end}"
                yield scrapy.Request(
                    url=url,
                    callback=self.parse_category,
                    meta={'category': category_key, 'start': start, 'end': end}
                )

    def parse_category(self, response):
        category = response.meta['category']
        data = json.loads(response.body)
        
        if 'query' in data and 'pages' in data['query']:
            pages = data['query']['pages']
            self.total_items += len(pages)
            
            for page in pages:
                item = {
                    'title': page['title'],
                    'category': category
                }
                
                self.items_arr[category].append(item)
                
                # 각 아이템에 대한 이미지 URL을 가져오기 위한 요청 생성
                yield scrapy.Request(
                    url=f"https://growtopia.fandom.com/wiki/{page['title']}",
                    callback=self.parse_item_page,
                    meta={'item': item}
                )
    
    def parse_item_page(self, response):
        item = response.meta['item']
        # .growsprite 클래스 내에서 첫 번째 이미지 찾기
        img_src = response.css('.growsprite img::attr(src)').get()
        
        if img_src:
            item['image'] = img_src
        else:
            item['image'] = None
            self.logger.warning(f"No image found for title: {item['title']}")
        
        self.processed_items += 1
        self.logger.info(f"이미지 불러오는 중: {item['title']}\n이미지 경로: {img_src}")
        
        # 모든 아이템이 처리되었는지 확인
        if self.processed_items == self.total_items:
            self.save_results()
    
    def save_results(self):
        # 결과 저장 및 출력
        with open('growtopia_items.json', 'w', encoding='utf-8') as f:
            json.dump(self.items_arr, f, ensure_ascii=False, indent=2)
        
        self.logger.info(f"Block count: {len(self.items_arr['block'])}")
        self.logger.info(f"Background count: {len(self.items_arr['backGround'])}")
        self.logger.info(f"Results saved to growtopia_items.json")

# 크롤러 실행 스크립트
if __name__ == '__main__':
    process = CrawlerProcess({
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'CONCURRENT_REQUESTS': 16,  # 병렬 요청 수
        'DOWNLOAD_DELAY': 0.25,  # 요청 간 딜레이, 서버에 부담을 줄이기 위한 설정
        'LOG_LEVEL': 'INFO'
    })
    
    process.crawl(GrowtopiaCrawler)
    process.start()