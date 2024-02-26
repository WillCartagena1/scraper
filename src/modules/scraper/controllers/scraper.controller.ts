import { Controller, Get, Query } from '@nestjs/common';
import { WebsiteAScraper, WebsiteBScraper } from '../services/scraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly websiteAScraper: WebsiteAScraper,
    private readonly websiteBScraper: WebsiteBScraper,
  ) {}

  @Get('products')
  async scrapeAmazon(
    @Query('url') url: string,
    @Query('maxPages') maxPages: number,
  ) {
    const productsData = await this.websiteAScraper.getProductDetails(url, maxPages);
    return productsData;
  }

  @Get('blog-post')
  async scrapeBlogPost(
    @Query('url') url: string,
  ) {
    const blogPostData = await this.websiteBScraper.getBlogPostDetails(url);
    return blogPostData;
  }
}
