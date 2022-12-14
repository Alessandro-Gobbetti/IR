from datetime import datetime

from forex_python.converter import CurrencyRates, CurrencyCodes


def make(site,  # Domain of scraped site
         page_link,  # Page link
         artist_name,
         artist_image,
         bio,
         bio_long,
         amount_post,
         amount_subs,
         price_tiers,  # List of price tiers. See function 'make_price_tier'
         tags,  # Tags list
         socialmedias,  # Social media links list
         artist_banner):
    # print(price_tiers)
    return {
        'site': site,
        'page_link': page_link,
        'artist_name': stripIfNotNone(artist_name),
        'artist_image': stripIfNotNone(artist_image),
        'artist_banner': artist_banner,
        'bio': stripIfNotNone(bio),
        'bio_long': stripIfNotNone(bio_long),
        'amount_post': amount_post,
        'amount_subs': amount_subs,
        'price_tiers_title': list(map(lambda tier: stripIfNotNone(tier['title']), price_tiers or [])),
        'price_tiers_monthly': list(map(lambda tier: stripIfNotNone(tier['monthly']), price_tiers or [])),
        'price_tiers_monthly_chf': list(map(lambda tier: convertCurrenciesToCHF(tier['monthly']), price_tiers or [])),
        'price_tiers_description': list(map(lambda tier: stripIfNotNone(tier['description']), price_tiers or [])),
        'tags': tags or [],
        'socialmedias': socialmedias or [],
        'indexDate': datetime.now().isoformat()
    }


def stripIfNotNone(string):
    return string.strip() if string else None


def make_price_tier(amount_per_month, title, description):
    return {
        'title': title,
        'monthly': amount_per_month,
        'description': description,
    }

def convertCurrenciesToCHF(price):
    # the amount is a string in any currency, like $5 or CHF10
    # we need to convert it to CHF
    # split the currency from the amount, todo so we need to find the first digit

    if not price:
        return 
    if price.lower() == 'free':
        return 0
    
    # find the first digit
    for i in range(len(price)):
        if price[i].isdigit():
            break
    
    # convert the currency symbol to the currency name
    
    map = {
        '$': 'USD',
        '€': 'EUR',
        '£': 'GBP',
        '¥': 'JPY',
        '₩': 'KRW',
        '₹': 'INR',
        '₽': 'RUB',
        '₺': 'TRY',
        '₴': 'UAH',
        '₪': 'ILS',
        '₫': 'VND',
        '₦': 'NGN',
        '₱': 'PHP',
        '฿': 'THB',
        '₡': 'CRC',
        '₢': 'BRL',
        '₣': 'FRF',
        '₤': 'GBP',
        '₥': 'ITL',
        '₧': 'ESP',
        'Fr': 'CHF',
        '円': 'JPY',
        '元': 'CNY',
        '₩': 'KRW',
        '₭': 'LAK',
        '₮': 'MNT',
        '₯': 'GRD',
        'CZK': 'CZK',
        'DKK': 'DKK',
        'NZD': 'NZD',
    }

    currency = map.get(price[:i].strip(), None)
    if not currency:
        # print red
        print('\033[91m' + 'Currency not found: ' + price[:i].strip() + ' from ' + price + '\033[0m')
        # by default we use CHF
        currency = 'CHF'
    amount = float(price[i:].strip().replace(',', ''))

    cr = CurrencyRates()
    # convert the amount to CHF
    return cr.convert(currency, 'CHF', amount)

    
            



        



