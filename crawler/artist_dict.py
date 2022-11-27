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
         socialmedias, # Social media links list
         artist_banner):
    return {
        'site': site,
        'page_link': page_link,
        'artist_name': artist_name,
        'artist_image': artist_image,
        'artist_banner' : artist_banner,
        'bio': bio,
        'bio_long': bio_long,
        'amount_post': amount_post,
        'amount_subs': amount_subs,
        'price_tiers': price_tiers,
        'tags': tags,
        'socialmedias': socialmedias
    }


def make_price_tier(amount_per_month, title, description):
    return {
        'monthly': amount_per_month,
        'description': description,
    }
