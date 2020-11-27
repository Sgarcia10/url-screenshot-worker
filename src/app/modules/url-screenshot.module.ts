import { Module } from '@nestjs/common';
import { UrlScreenshotService } from 'src/core/services/url-screenshot.service';
import { PuppeteerProvider } from 'src/domain/provider/puppeteer.provider';
import { S3Provider } from 'src/domain/provider/s3.provider';
import { SqsProvider } from 'src/domain/provider/sqs.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [UrlScreenshotService, SqsProvider, S3Provider, PuppeteerProvider]
})
export class UrlScreenshotModule {}
