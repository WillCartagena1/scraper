import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './controllers/scraper.controller';
import { WebsiteAScraper, WebsiteBScraper } from './services/scraper.service';

describe('ScraperController', () => {
  let controller: ScraperController;
  let websiteAScraper: WebsiteAScraper;
  let websiteBScraper: WebsiteBScraper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [WebsiteAScraper, WebsiteBScraper],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
    websiteAScraper = module.get<WebsiteAScraper>(WebsiteAScraper);
    websiteBScraper = module.get<WebsiteBScraper>(WebsiteBScraper);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should scrape product details from Amazon', async () => {
    const testUrl = 'https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071%2Cp_36%3A1253503011&dc&fs=true&qid=1635596580&rnid=16225007011&ref=sr_pg_1';
    const maxPages = 1;
    const getProductDetailsSpy = jest.spyOn(websiteAScraper, 'getProductDetails');
    await controller.scrapeAmazon(testUrl, maxPages);
    expect(getProductDetailsSpy).toHaveBeenCalledWith(testUrl, maxPages);
  });

  it('should scrape blog post details', async () => {
    jest.setTimeout(20000);
    const testUrl = 'https://www.theverge.com/2024/2/25/24083175/apples-homepod-could-get-a-screen-next-year';
    const getBlogPostDetailsSpy = jest.spyOn(websiteBScraper, 'getBlogPostDetails');
    await controller.scrapeBlogPost(testUrl);
    expect(getBlogPostDetailsSpy).toHaveBeenCalledWith(testUrl);
  });

});
