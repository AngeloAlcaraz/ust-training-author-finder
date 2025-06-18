import 'dotenv/config';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION ?? 'us-east-1';
const queueUrl = process.env.FAVORITES_QUEUE_URL;
const tableName = process.env.FAVORITES_TABLE_NAME ?? 'Favorites';

if (!queueUrl) {
  throw new Error('FAVORITES_QUEUE_URL is not defined in .env');
}

const sqsClient = new SQSClient({ region });
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export async function pollQueue() {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
    });

    const response = await sqsClient.send(command);

    if (response.Messages && response.Messages.length > 0) {
      const message = response.Messages[0];
      const body = JSON.parse(message.Body!);

      try {
        if (body.type === 'AddFavorite') {
          await ddbDocClient.send(
            new PutCommand({
              TableName: tableName,
              Item: body,
            }),
          );
          console.log(`Added favorite to DynamoDB: ${body.authorId}`);
        } else if (body.type === 'RemoveFavorite') {
          await ddbDocClient.send(
            new DeleteCommand({
              TableName: tableName,
              Key: {
                addedBy: body.addedBy,
                authorId: body.authorId,
              },
            }),
          );
          console.log(`Removed favorite from DynamoDB: ${body.authorId}`);
        } else {
          console.warn('Unknown message type:', body.type);
        }

        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle!,
          }),
        );
      } catch (processingError) {
        console.error('Error processing message:', processingError);
      }
    }
  } catch (err) {
    console.error('Error polling the queue:', err);
  }
}

async function startPolling() {
  while (true) {
    await pollQueue();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Export the pollQueue function for testing purposes
if (require.main === module) {
  startPolling();
}
