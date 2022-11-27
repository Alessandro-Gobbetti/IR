import scrapy
import artist_dict
import re


class SubscribeStarSpider(scrapy.Spider):
    name = 'subscribestar'
    stat_matcher = re.compile(r'^(\d+)')

    start_urls = [
        'https://www.subscribestar.com/stars?_page=true&page=1',
    ]

    custom_settings = {
        "LOG_LEVEL": "INFO",
    }

    async def parse(self, response):
        """Parse the search results page to get the artist's name, short description, image, etc."""
        print('\033[92m' + "Parsing: " + response.url + '\033[0m')

        for artist in response.css('.star_item-avatar::attr("href")').getall():
            yield scrapy.Request(url=response.urljoin(artist), callback=self.parse_artist)

        next_page = response.css(".pagination-next a[rel='next']::attr('href')").get()
        if next_page is not None:
           yield scrapy.Request(url=response.urljoin(next_page), callback=self.parse)

    async def parse_artist(self, response):
        subscribers = self.stat_matcher.search(response.css('.subscribers_count:last-child::text').get(default=""))
        subscribers = "" if subscribers is None else subscribers.group(1)

        posts = self.stat_matcher.search(response.css('.posts_count:last-child::text').get(default=""))
        posts = "" if posts is None else posts.group(1)

        tiers = list(map(lambda tier:
                         artist_dict.make_price_tier(tier.css('.tiers-settings_item-cost::text').get(),
                                                     tier.css('.tiers-settings_item-title::text').get(),
                                                     tier.css('.tiers-settings_item-description p::text').get())
            ,response.css('div.tiers .tier-body')))
        # print(tiers)

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
