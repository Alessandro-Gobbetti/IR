# IR

To scrape a website, navigate to the **`./crawler/crawler`** directory and run the following command:

```bash
scrapy runspider path/to/spider.py -o path/to/output.json
```

If you run it from another directory the scrapy will not be able to find the settings and the scraper will fail.