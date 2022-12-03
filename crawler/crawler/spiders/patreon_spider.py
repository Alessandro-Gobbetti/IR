import scrapy
from scrapy_playwright.page import PageMethod
import re
import artist_dict


class PatreonSpider(scrapy.Spider):
    name = 'patreon'
    stat_matcher = re.compile(r'^(\d+)')

    custom_settings = {
        "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
        "DOWNLOAD_HANDLERS": {
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        "LOG_LEVEL": "INFO",
    }

    def __init__(self, tags=None, artists=None, searches=None, **kwargs):
        self.default_tags = ['Advice', 'Animation', 'Art', 'Blogging', 
                            'Comedy', 'Comics', 'Commissions', 'Community', 
                            'Cooking', 'Cosplay', 'Crafts', 'Dance', 'Theatre', 
                            'Design', 'Drawing', 'Painting', 'Education', 'Food', 
                            'Drink', 'Fashion', 'Fundraising', 'Game Development',
                            'Gaming', 'Health', 'Journalism', 'Fitness', 'Lifestyle', 
                            'Money', 'Music', 'News', 'Nsfw', 'Photography', 
                            'Podcast', 'Politics', 'Science', 'Tech', 'Social', 'Software', 
                            'Spirituality', 'Streaming', 'Video', 'Film', 'Writing']

        if tags == 'null':
            tags = []
        elif tags:
            tags = tags.split(',')
            # update the tags list with the new tags
            for tag in tags:
                if tag not in self.default_tags:
                    self.default_tags.append(tag)
        else:
            tags = self.default_tags

        if searches:
            searches = searches.split(',')
            for query in searches:
                tags.append(query)

        # create an url for each tag
        self.start_urls = [f'https://www.patreon.com/search?q={tag}' for tag in tags]

        self.artists_urls = []
        if artists:
            self.artists_urls = artists.split(',')

        super().__init__(**kwargs)

    

    def start_requests(self):
        """Start the requests with playwright, so we can wait for the page to load."""
        for url in self.start_urls:
            yield scrapy.Request(url, meta={
                'playwright': True,
                'playwright_include_page': True,
                'playwright_page_methods': [
                    PageMethod('wait_for_selector',
                               'div[data-tag="campaign-result"]')
                ],
                'errback': self.errback,
            })

        for url in self.artists_urls:
            yield scrapy.Request(url, callback=self.parse_artist, meta={'tags': None})

    async def parse(self, response):
        """Parse the search results page to get the artist's name, short description, image, etc."""
        page = response.meta['playwright_page']
        await page.close()

        print('\033[92m' + "Parsing: " + response.url + '\033[0m')

        # parse url to guess category
        tag = response.url.split('search?q=')[1]
        tag = tag.split('&')[0]
        tags = []
        if tag in self.default_tags:
            tags.append(tag)

        for artist in response.css('div[data-tag="campaign-result"]'):
            url = artist.css('a::attr(href)').get()
            posts = artist.css('p.sc-jrQzAO.DzYUV::text').get()
            patrons = self.stat_matcher.search(artist.css('p[data-tag="campaign-result-patron-count"]::text').get(default=""))

            # parse posts and patrons as int
            posts = int(self.stat_matcher.search(posts).group(1))
            if patrons:  # patrons number might be missing (private)
                patrons = int(patrons.group(1))

            # follow the artist's page to get the long description, pricing, etc.
            yield scrapy.Request(url, callback=self.parse_artist, meta={
                'posts': posts,
                'patrons': patrons,
                'tags': tags,
            })

        # the next page is the first link after the current page
        next_page = response.css('div.sc-exfcb4-1.cAQEhl + a::attr(href)').get()

        if next_page is not None:
            yield scrapy.Request(next_page, meta={
                'playwright': True,
                'playwright_include_page': True,
                'playwright_page_methods': [
                    PageMethod('wait_for_selector',
                               'div[data-tag="campaign-result"]')
                ],
                'errback': self.errback,
            })

    def parse_artist(self, response):
        """Parse the artist's page to get the long description, pricing, etc."""
        print('\033[90m' + "\tParsing: " + response.url + '\033[0m')

        name = response.css('h1#pageheader-title::text').get()
        image = response.css('div#avatar-image::attr(src)').get()

        posts = response.meta.get('posts')
        if posts is None:
            posts = response.css('div[color="brand"]::text').get()
            posts = int(posts.replace(',', '')) if posts else None

        subs = response.meta.get('patrons')
        if subs is None:
            subs = response.css('.sc-kfPuZi.hJYemi::text').get()
            if subs:
                subs = subs.replace(',', '')
                subs = int(subs) if subs.isdigit() else None

        short_desc = response.css('div.sc-jrQzAO.bsIqPC::text').get()

        pricing = list(map(lambda tier:
                           artist_dict.make_price_tier(tier.css('div.sc-bkkeKt.cupyBO::text').get(),
                                                       tier.css('h3[data-tag="tier-title"]::text').get(),
                                                       ' '.join(tier.css('.sc-1rlfkev-0.MtGiR *::text').getall()))
                           , response.css('div[data-tag="reward-tier-card"]')))
        long_desc = response.css('div[data-tag="summary-container"] *::text').getall()
        long_desc = ' '.join(long_desc)

        socialmedias = response.css('div[data-tag="campaign-social-links"] a[role="button"]::attr("href")').getall()

        # the background image is in the embedded css, every time it is in a class with a different name
        # we know that the background image is the last one in the css
        banner = re.findall('background-image:url\(([^)]+)\)', response.text)
        banner = banner[-1] if len(banner) > 0 else None

        yield artist_dict.make(
            site = self.name,
            page_link = response.url,
            artist_name = name, 
            artist_image = image,
            bio = short_desc,
            bio_long = long_desc,
            amount_post = posts,
            amount_subs = subs,
            price_tiers = pricing,
            tags = response.meta['tags'],
            socialmedias = socialmedias,
            artist_banner = banner,
        )

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()
