import scrapy
from scrapy_playwright.page import PageMethod
import artist_dict


class KoFiSpider(scrapy.Spider):
    name = 'ko-fi'

    custom_settings = {
        "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
        "DOWNLOAD_HANDLERS": {
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        "DOWNLOAD_DELAY": 3,
        "LOG_LEVEL": "INFO",
    }
    
    # By default, crawls many tags. Array is passed as a string delimited by comma.
    def __init__(self, tags=None, artists=None, searches=None, **kwargs):

        if tags == 'null':
            tags = []
        elif tags:
            tags = tags.split(',')
        else:
            tags = ['Advice', 'Animation', 'Art', 'Blogging',
                    'Comedy', 'Comics', 'Commissions', 'Community',
                    'Cosplay', 'Crafts', 'Dance & Theatre', 'Design',
                    'Drawing & Painting', 'Education', 'Food & Drink',
                    'Fundraising', 'Game Development', 'Gaming',
                    'Health & Fitness', 'Lifestyle', 'Money', 'Music',
                    'News', 'Nsfw', 'Other', 'Photography', 'Podcast',
                    'Science & Tech', 'Social', 'Software', 'Spirituality',
                    'Streaming', 'Video and Film', 'Writing']
        # create an url for each tag
        self.start_urls = [f'https://ko-fi.com/explore?category={tag}' for tag in tags ]

        self.artists_urls = []
        if artists:
            self.artists_urls = artists.split(',')

        super().__init__(**kwargs)


    def start_requests(self):
        """Start the requests with playwright, so we can wait for the page to load."""
        for url in self.start_urls:
            yield scrapy.Request(url, 
                callback=self.parse,
                meta={
                'playwright': True,
                'playwright_include_page': True,
                'errback': self.errback,
            })
        for url in self.artists_urls:
            yield scrapy.Request(url, 
                callback=self.parse_artist,
                meta={
                'playwright': True,
                'playwright_include_page': True,
                'playwright_page_methods': [
                        PageMethod('wait_for_selector',
                                'div.kfds-c-srf-topdetail-wrapper div.kfds-font-bold > span')
                    ],
                'errback': self.errback,
            })

    async def parse(self, response):
        """Parse the search results page to get the artist's name, short description, image, etc."""
        page = response.meta['playwright_page']
        await page.close()

        print('\033[92m' + "Parsing: " + response.url + '\033[0m')

        # get the artist's urls.
        artist_urls = response.css('div.flex-wrap-explore-card a::attr(href)').getall()

        for artist_url in artist_urls:
            # the url is relative to the base url
            artist_url = response.urljoin(artist_url)

            yield scrapy.Request(
                artist_url, 
                callback=self.parse_artist, 
                meta={
                    'playwright': True,
                    'playwright_include_page': True,
                    'playwright_page_methods': [
                        PageMethod('wait_for_selector',
                                'div.kfds-c-srf-topdetail-wrapper div.kfds-font-bold > span')
                    ],
                    'errback': self.errback,
                })


    async def parse_artist(self, response):
        """Parse the artist's page to get the long description, pricing, etc."""
        page = response.meta['playwright_page']
        await page.close()

        print('\033[90m' + "\tParsing: " + response.url + '\033[0m')


        name = response.css('div.kfds-c-srf-topdetail-wrapper div.kfds-font-bold > span::text').get()
        supporters = response.css('span.kfds-c-profile-link-handle.kfds-font-clr-dark::text').get()
        # remove ' Supporters'
        if supporters is not None and len(supporters) > 0:
            supporters = supporters.split(' ')[0]
            # remove commas
            supporters = supporters.replace(',', '')
            
            
        if supporters is not None and len(supporters) > 0:  
            # the last character may be a K or M
            if supporters[-1].upper() == 'K':
                supporters = supporters[:-1].strip()
                supporters = int(float(supporters) * 1000)
            elif supporters[-1].upper() == 'M':
                supporters = supporters[:-1].strip()
                supporters = int(float(supporters) * 1_000_000)
            elif supporters.isdigit():
                supporters = int(supporters)
        else:
            supporters = None
        if not type(supporters) == int:
            supporters = None
        
        pic = response.css('img#profilePicture::attr(src)').get()
        banner_pic = response.css('div#profile-header::attr(style)').get()
        # get the background:url(...) from the style attribute
        if banner_pic:
            banner_pic = banner_pic[banner_pic.find('background:url(')+len('background:url('):banner_pic.find(')')]
        bio = response.css('p.kfds-c-para-control.line-breaks.break-long-words::text').get()
        tags = response.css('span.label-tag::text').getall()
        socials = response.css('div.social-profile-link a::attr(href)').getall()

        # get the pricing
        tiers = list(map(lambda tier:
                         artist_dict.make_price_tier(
                            amount_per_month= (tier.css('div.kfds-lyt-row.kfds-lyt-center span.kfds-font-size-16.kfds-font-bold::text').get() +
                                               tier.css('div.kfds-lyt-row.kfds-lyt-center span.kfds-font-size-20.kfds-font-bold::text').get()),
                            title=tier.css('.kfds-font-bold.kfds-lyt-width-100.kfds-font-size-20.kfds-c-word-wrap.text-center::text').get(),
                            description=tier.css('div.ds-benefit-wrapper p.break-long-words.kfds-c-word-wrap.line-breaks::text').get()),
            response.css('div.ds-tier-flex')))


        yield artist_dict.make(
            site=self.name,
            page_link=response.url,
            artist_name = name,
            artist_image = pic,
            artist_banner = banner_pic,
            bio=bio,
            bio_long=None,
            amount_post=None,
            amount_subs=supporters,
            price_tiers=tiers, 
            tags=tags, 
            socialmedias=socials,
        )

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()
