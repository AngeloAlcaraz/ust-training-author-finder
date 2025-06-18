import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

@Injectable()
export class FavoritesService {
  private readonly client: SQSClient;
  private readonly queueUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new SQSClient({ region: this.configService.get<string>('AWS_REGION') ?? 'us-east-1' });
    this.queueUrl = this.configService.get<string>('FAVORITES_QUEUE_URL')!;
  }

  async enqueueFavorite(createFavoriteDto: any) {
    const message = {
      type: 'AddFavorite',
      ...createFavoriteDto,
      timestamp: new Date().toISOString(),
    };

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    });

    await this.client.send(command);
  }
}
