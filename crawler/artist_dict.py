from datetime import datetime


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
