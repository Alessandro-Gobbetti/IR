import scrapy


class SubscribeStarSpider(scrapy.Spider):
    name = 'subscribestar'
    start_urls = [
        'https://www.subscribestar.com/stars?_page=true&page=1', 
        ]

    custom_settings = {
        "LOG_LEVEL": "INFO",
    }



    async def parse(self, response):
        """Parse the search results page to get the artist's name, short description, image, etc."""
        print('\033[92m' + "Parsing: " + response.url + '\033[0m')

        for artist in response.css('div.star_item'):
            continue

        
