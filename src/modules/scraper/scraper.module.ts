import { Module } from '@nestjs/common';
import { ScraperController } from './controllers/scraper.controller';
import { WebsiteAScraper } from './services/scraper.service';

@Module({
  imports: [],
  controllers: [ScraperController],
  providers: [WebsiteAScraper],
})
export class AppModule {}
