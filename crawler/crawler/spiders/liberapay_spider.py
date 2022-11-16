import scrapy
from playwright.async_api import async_playwright


# TODO: this site might be a good candidate to scrape, no need to query random stuff, it has a list with all the artists.
# FIXME: the only problem it an-anti-bot system that blocks the requests at the beginning. :'(
# See https://pypi.org/project/scrapy-cloudflare-middleware/ for a possible solution
# or just choose another site to scrape
class LiberapaySpider(scrapy.Spider):
    name = 'liberapay'
    start_urls = ['https://en.liberapay.com/explore/individuals']


    async def parse(self, response):
        # TODO: Implement this method
        
        return 