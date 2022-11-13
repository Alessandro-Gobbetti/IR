import scrapy

class PatreonSpider(scrapy.Spider):
    name = 'patreon'
    start_urls = ['https://www.patreon.com/']

    def parse(self, response):
        # TODO: Implement this method
        # for quote in response.css('div.quote'):
        #     author = quote.css('.author::text').get()
        #     text = quote.css('.text::text').get()
        #     tags = quote.css('.tag::text').getall()
            
        #     yield {'author': author, 
        #            'text': text, 
        #            'tags': tags} 

        # next_page = response.css('li.next a::attr(href)').get()

        # if next_page is not None:
        #     yield response.follow(next_page, self.parse)
        return 