import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';

@Injectable()
export class PuppeteerProvider {
  async screenshot(url: string, pathTmp: string, fileName: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: path.join(pathTmp, fileName) });
    await browser.close();
  }
}
