import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { FavoritesQueueService } from '../../src/queues/favorites-queue.service';

jest.mock('@aws-sdk/client-sqs');

describe('FavoritesQueueService', () => {
  let service: FavoritesQueueService;
  let sendMock: jest.Mock;
  let lastSendCommand: any;

  beforeEach(() => {
    sendMock = jest.fn().mockResolvedValue({});
    
    (SendMessageCommand as unknown as jest.Mock) = jest.fn().mockImplementation((input) => ({
      input,
    }));

    (SQSClient as jest.Mock).mockImplementation(() => ({
      send: sendMock,
    }));

    service = new FavoritesQueueService({
      get: (key: string) => {
        if (key === 'AWS_REGION') return 'us-east-1';
        if (key === 'FAVORITES_QUEUE_URL') return 'https://queue-url';
        return undefined;
      },
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
    lastSendCommand = null;
  });

  it('enqueueFavorite sends AddFavorite message', async () => {
    const dto = { authorId: '123', addedBy: 'user1' };
    sendMock.mockImplementation(async (command) => {
      lastSendCommand = command;
      return {};
    });

    await service.enqueueFavorite(dto);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(lastSendCommand).toBeDefined();

    const messageBody = JSON.parse(lastSendCommand.input.MessageBody);

    expect(messageBody.type).toBe('AddFavorite');
    expect(messageBody.authorId).toBe(dto.authorId);
    expect(messageBody.addedBy).toBe(dto.addedBy);
    expect(messageBody.timestamp).toBeDefined();
  });

  it('enqueueFavoriteRemoved sends RemoveFavorite message', async () => {
    const authorId = '123';
    const addedBy = 'user1';

    sendMock.mockImplementation(async (command) => {
      lastSendCommand = command;
      return {};
    });

    await service.enqueueFavoriteRemoved(authorId, addedBy);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(lastSendCommand).toBeDefined();

    const messageBody = JSON.parse(lastSendCommand.input.MessageBody);

    expect(messageBody.type).toBe('RemoveFavorite'); 
    expect(messageBody.timestamp).toBeDefined();
  });
});
