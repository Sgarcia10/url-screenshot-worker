import * as aws from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class S3Provider {
  private s3: aws.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new aws.S3({
      secretAccessKey: configService.s3SecretAccessKey,
      accessKeyId: configService.s3AccessKey,
      region: configService.awsRegion
    });
  }

  get S3(): aws.S3 {
    return this.s3;
  }

  async uploadFile(pathInput: string, pathOutput: string, fileName: string): Promise<string> {
    const fileContent = fs.readFileSync(path.join(pathInput, fileName));
    const params: PutObjectRequest = {
      Bucket: this.configService.s3Bucket,
      Key: `${pathOutput}/${fileName}`,
      Body: fileContent,
      ContentType: 'image/png',
      ACL: 'public-read'
    };

    return (await this.s3.upload(params).promise())?.Location;
  }
}
