import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

@Injectable()
export class WebsiteCrawlerService {
  private browser: puppeteer.Browser;

  async openBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
    });
  }

  async goToPage(url: string) {
    const page = await this.browser.newPage();
    await page.goto(url);
    return page;
  }

  async closeBrowser() {
    await this.browser.close();
  }
}

@Injectable()
export class WebsiteAScraper extends WebsiteCrawlerService {
  async getProductDetails(url: string, maxPages: number = 1) {
    await this.openBrowser();
    const page = await this.goToPage(url);
    await page.waitForSelector('[data-cel-widget="search_result_0"]');
    let productsData = [];

    const productsHandles = await page.$$(
      'div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item',
    );

    for (const producthandle of productsHandles) {
      let title: string;
      let price: string;

      try {
        title = await producthandle.$eval(
          'h2 > a > span',
          (el) => el.textContent,
        );

        price = await producthandle.$eval(
          '.a-price > .a-offscreen',
          (el) => el.textContent,
        );
      } catch (error) {
        throw new Error(error)
      }
    }

    await this.closeBrowser();
    return productsData;
  }

  async writeCSV(productsData: any[], filePath: string) {
    try {
      let csvContent = 'Title,Price,Image\n';
      productsData.forEach((product) => {
        csvContent += `${product.title},${product.price},${product.img}\n`;
      });
      fs.writeFileSync(filePath, csvContent);
      console.log('CSV file has been written successfully.');
    } catch (error) {
      console.error('Error writing CSV file:', error);
    }
  }
}

export class WebsiteBScraper extends WebsiteCrawlerService {
  async getBlogPostDetails(url: string) {
    await this.openBrowser();
    const page = await this.goToPage(url);
    const blogPost = await page.$('.blog-post');

    const author = await this.getTextContent(blogPost, '.author');
    const title = await this.getTextContent(blogPost, '.title');
    const comments = await this.getNumberContent(blogPost, '.comments');

    await this.closeBrowser();
    return { author, title, comments };
  }

  private async getTextContent(
    elementHandle: puppeteer.ElementHandle<Element>,
    selector: string,
  ) {
    try {
      return (
        (await elementHandle.$eval(selector, (el) => el.textContent.trim())) ||
        'Unknown'
      );
    } catch (error) {
      return 'Unknown';
    }
  }

  private async getNumberContent(
    elementHandle: puppeteer.ElementHandle<Element>,
    selector: string,
  ) {
    try {
      const textContent = await elementHandle.$eval(selector, (el) =>
        el.textContent.trim(),
      );
      return parseInt(textContent) || 0;
    } catch (error) {
      return 0;
    }
  }
}
