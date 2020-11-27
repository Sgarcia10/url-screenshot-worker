import { Injectable } from '@nestjs/common';
import { SqsProvider } from 'src/domain/provider/sqs.provider';
import { ConfigService } from 'src/config/config.service';
import { CreateScreenshotMessage } from 'src/domain/models/createScreenshotMessage.model';
import { S3Provider } from 'src/domain/provider/s3.provider';
import { PuppeteerProvider } from 'src/domain/provider/puppeteer.provider';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from 'src/domain/logger/logger.service';

@Injectable()
export class UrlScreenshotService {
  constructor(
    private sqsProvider: SqsProvider<CreateScreenshotMessage>,
    private configService: ConfigService,
    private s3Provider: S3Provider,
    private puppeteerProvider: PuppeteerProvider,
    private logger: Logger
  ) {
    this.sqsProvider.messageEmiter.subscribe((m) => this.create(m));
  }

  async create(createScreenshotMessage: CreateScreenshotMessage): Promise<void> {
    let pathTmp = '/tmp';
    if (this.configService.env === 'local') pathTmp = path.resolve('tmp');
    const pathS3 = 'url-screenshot';

    if (!fs.existsSync(pathTmp)) {
      fs.mkdirSync(pathTmp);
    }

    try {
      const fileName = createScreenshotMessage.imageName;
      const url = createScreenshotMessage.url;
      await this.puppeteerProvider.screenshot(url, pathTmp, fileName);
      await this.s3Provider.uploadFile(pathTmp, pathS3, fileName);
      fs.unlinkSync(path.join(pathTmp, fileName));
    } catch (error) {
      this.logger.error(error);
    }
  }
}
