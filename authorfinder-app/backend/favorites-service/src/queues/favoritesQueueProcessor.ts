import 'dotenv/config';
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION ?? 'us-east-1';
const queueUrl = process.env.FAVORITES_QUEUE_URL;
const tableName = process.env.FAVORITES_TABLE_NAME ?? 'Favorites';

if (!queueUrl) {
  throw new Error('FAVORITES_QUEUE_URL is not defined in .env');
}

const sqsClient = new SQSClient({ region });
const ddbClient = new DynamoDBClient({ region });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

async function pollQueue() {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
    });

    const response = await sqsClient.send(command);

    if (response.Messages && response.Messages.length > 0) {
      const message = response.Messages[0];

      try {
        const favorite = JSON.parse(message.Body!);

        await ddbDocClient.send(
          new PutCommand({
            TableName: tableName,
            Item: favorite,
          })
        );

        await sqsClient.send(
          new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle!,
          })
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
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

startPolling();
