import { Module, Global } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Global()
@Module({
  providers: [
    {
      provide: 'DYNAMO_CLIENT',
      useFactory: () => {
        const client = new DynamoDBClient({
          region: process.env.AWS_REGION ?? 'us-east-1',
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
          },
        });
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
  exports: ['DYNAMO_CLIENT'],
})
export class DynamoModule {}
