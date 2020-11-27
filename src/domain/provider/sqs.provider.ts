import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { Subject } from 'rxjs';
import { Consumer } from 'sqs-consumer';

@Injectable()
export class SqsProvider<T> {
  private queueUrl: string;
  private messageEmiter$: Subject<T>;

  constructor(private configService: ConfigService) {
    this.messageEmiter$ = new Subject();
    this.queueUrl = `https://sqs.${configService.awsRegion}.amazonaws.com/${configService.awsAccountId}/${configService.awsQueueName}`;

    const consumer = Consumer.create({
      queueUrl: this.queueUrl,
      handleMessage: async (message) => {
        const body = JSON.parse(message.Body) as T;
        this.messageEmiter$.next(body);
      }
    });

    consumer.start();
  }

  get messageEmiter(): Subject<T> {
    return this.messageEmiter$;
  }
}
