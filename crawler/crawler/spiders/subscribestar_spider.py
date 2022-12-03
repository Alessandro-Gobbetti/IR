import scrapy
import artist_dict
import re


class SubscribeStarSpider(scrapy.Spider):
    name = 'subscribestar'
    stat_matcher = re.compile(r'^(\d+)')

    custom_settings = {
        "LOG_LEVEL": "INFO",
    }

    def __init__(self, tags=None, artists=None, searches=None, **kwargs):
        '''Initialize the spider if a list of artists is provided then only scrape those artists, else scrape all the website'''
        self.start_urls = []
        self.artists_urls = []
        if artists:
            self.artists_urls = artists.split(',')
        else:
            self.start_urls = [
                'https://www.subscribestar.com/stars?_page=true&page=1',
            ]

        super().__init__(**kwargs)


    def start_requests(self):
        """Start the requests"""
        for url in self.start_urls:
            yield scrapy.Request(url, callback=self.parse)

        for url in self.artists_urls:
            yield scrapy.Request(url, callback=self.parse_artist)


    async def parse(self, response):
        """Parse the search results page to get the artist's name, short description, image, etc."""
        print('\033[92m' + "Parsing: " + response.url + '\033[0m')

        for artist in response.css('.star_item-avatar::attr("href")').getall():
            yield scrapy.Request(url=response.urljoin(artist), callback=self.parse_artist)

        next_page = response.css(".pagination-next a[rel='next']::attr('href')").get()
        if next_page is not None:
           yield scrapy.Request(url=response.urljoin(next_page), callback=self.parse)

    async def parse_artist(self, response):
        print('\033[90m' + "\tParsing: " + response.url + '\033[0m')

        subscribers = self.stat_matcher.search(response.css('.subscribers_count:last-child::text').get(default=""))
        subscribers = "" if subscribers is None else subscribers.group(1)

        posts = self.stat_matcher.search(response.css('.posts_count:last-child::text').get(default=""))
        posts = "" if posts is None else posts.group(1)

        tiers = list(map(lambda tier:
                         artist_dict.make_price_tier(tier.css('.tiers-settings_item-cost::text').get(),
                                                     tier.css('.tiers-settings_item-title::text').get(),
                                                     tier.css('.tiers-settings_item-description p::text').get())
            ,response.css('div.tiers .tier-body')))

        yield artist_dict.make(
            self.name,
            response.url,
            response.css('.profile_main_info-name::text').get(),
            response.css('.profile_main_info-userpic img::attr("src")').get(),
            response.css('.profile_main_info-description::text').get(),
            None,
            posts,
            subscribers,
            tiers,
            response.css('.profile_categories.for-profile_main_info .profile_categories-category a::text').getall(),
            [],
            response.css('.profile_main_info-cover::attr("src")').get(),
        )
