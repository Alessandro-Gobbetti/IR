import scrapy
from scrapy_playwright.page import PageMethod


class PatreonSpider(scrapy.Spider):
    name = 'patreon'
    start_urls = [
        'https://www.patreon.com/search?q=python', 
        'https://www.patreon.com/search?q=html'
        ]

    custom_settings = {
        "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
        "DOWNLOAD_HANDLERS": {
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        "LOG_LEVEL": "INFO",
    }

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, meta={
                'playwright': True,
                'playwright_include_page': True, 
                'playwright_page_methods': [
                    PageMethod('wait_for_selector', 'div[data-tag="campaign-result"]')
                    ],
                'errback': self.errback,
            })


    async def parse(self, response):

        page = response.meta['playwright_page']
        await page.close()

        for artist in response.css('div[data-tag="campaign-result"]'):
            name = artist.css('span::text').get()
            url = artist.css('a::attr(href)').get()
            image = artist.css('div[data-tag="campaign-result-avatar"]::attr(src)').get()
            posts = artist.css('p.sc-jrQzAO.DzYUV::text').get()
            patrons = artist.css('p[data-tag="campaign-result-patron-count"]::text').get()
            # TODO: get the rest of the data (short desc, long desc, ...)
            
            # remove " posts" from posts
            posts = int(posts[:-5].strip().replace(',',''))
            if patrons: # patrons number might be missing
                # remove " patrons" from patrons
                patrons = int(patrons[:-7].strip().replace(',',''))

            yield {
                'name': name,
                'url': url,
                'image': image,
                'posts': posts,
                'patrons': patrons
                }

        # the next page is the first link after the current page
        next_page = response.css('div.sc-exfcb4-1.cAQEhl + a::attr(href)').get()

        if next_page is not None:
            print('\033[92m' + "Following: " + next_page + '\033[0m', end="\r")
            yield scrapy.Request(next_page, meta={
                'playwright': True,
                'playwright_include_page': True, 
                'playwright_page_methods': [
                    PageMethod('wait_for_selector', 'div[data-tag="campaign-result"]')
                    ],
                'errback': self.errback,
            })


    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()

