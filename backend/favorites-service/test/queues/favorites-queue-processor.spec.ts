import { pollQueue } from '../../src/queues/favorites-queue-processor';

jest.mock('@aws-sdk/client-sqs', () => {
  const mockSend = jest.fn();

  return {
    SQSClient: jest.fn(() => ({
      send: mockSend,
    })),
    ReceiveMessageCommand: jest.fn((args) => ({ input: args })),
    DeleteMessageCommand: jest.fn((args) => ({ input: args })),
    __mockSend: mockSend,
  };
});

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(() => ({})),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => {  
  const { __mockSend } = jest.requireMock('@aws-sdk/client-sqs');

  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: __mockSend,
      })),
    },
    PutCommand: jest.fn((args) => ({ input: args })),
    DeleteCommand: jest.fn((args) => ({ input: args })),
  };
});

describe('pollQueue', () => {
  let mockSend: jest.Mock;

  beforeEach(() => {   
    const sqsModule = jest.requireMock('@aws-sdk/client-sqs');
    mockSend = sqsModule.__mockSend;
    mockSend.mockReset();

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should process AddFavorite message', async () => {
    mockSend
      .mockResolvedValueOnce({
        Messages: [
          {
            Body: JSON.stringify({ type: 'AddFavorite', authorId: '123', addedBy: 'user1' }),
            ReceiptHandle: 'abc123',
          },
        ],
      })
      .mockResolvedValueOnce({}) // PutCommand
      .mockResolvedValueOnce({}); // DeleteMessageCommand

    await pollQueue();

    expect(mockSend).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith('Added favorite to DynamoDB: 123');
  });

  it('should process RemoveFavorite message', async () => {
    mockSend
      .mockResolvedValueOnce({
        Messages: [
          {
            Body: JSON.stringify({ type: 'RemoveFavorite', authorId: '456', addedBy: 'user2' }),
            ReceiptHandle: 'xyz456',
          },
        ],
      })
      .mockResolvedValueOnce({}) // DeleteCommand
      .mockResolvedValueOnce({}); // DeleteMessageCommand

    await pollQueue();

    expect(mockSend).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith('Removed favorite from DynamoDB: 456');
  });

  it('should log unknown message type', async () => {
    mockSend
      .mockResolvedValueOnce({
        Messages: [
          {
            Body: JSON.stringify({ type: 'UnknownType' }),
            ReceiptHandle: 'zzz789',
          },
        ],
      })
      .mockResolvedValueOnce({}); // DeleteMessageCommand

    await pollQueue();

    expect(console.warn).toHaveBeenCalledWith('Unknown message type:', 'UnknownType');
  });

  it('should handle processing error', async () => {
    const error = new Error('DynamoDB error');

    mockSend
      .mockResolvedValueOnce({
        Messages: [
          {
            Body: JSON.stringify({ type: 'AddFavorite', authorId: '999', addedBy: 'userX' }),
            ReceiptHandle: 'err123',
          },
        ],
      })
      .mockRejectedValueOnce(error);

    await pollQueue();

    expect(console.error).toHaveBeenCalledWith('Error processing message:', error);
  });

  it('should handle polling error', async () => {
    const error = new Error('SQS error');
    mockSend.mockRejectedValueOnce(error);

    await pollQueue();

    expect(console.error).toHaveBeenCalledWith('Error polling the queue:', error);
  });

  it('should do nothing when no messages', async () => {
    mockSend.mockResolvedValueOnce({ Messages: [] });

    await pollQueue();

    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
