import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { FavoritesQueueService } from '../../src/queues/favorites-queue.service';

jest.mock('@aws-sdk/client-sqs', () => {
    return {
        SQSClient: jest.fn().mockImplementation(() => ({
            send: jest.fn(),
        })),
        SendMessageCommand: jest.fn((input) => input), 
    };
});

describe('FavoritesQueueService', () => {
    let service: FavoritesQueueService;
    let sqsClientSendMock: jest.Mock;

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {}); 

        const mockConfigService = {
            get: jest.fn((key: string) => {
                if (key === 'AWS_REGION') return 'us-east-1';
                if (key === 'FAVORITES_QUEUE_URL') return 'https://queue-url';
                return null;
            }),
        };

        service = new FavoritesQueueService(mockConfigService as any);

        sqsClientSendMock = (service as any).client.send;
        sqsClientSendMock.mockClear();
        (SendMessageCommand as unknown as jest.Mock).mockClear();
    });

    it('enqueueFavorite should send AddFavorite message', async () => {
        const dto = { authorId: 'author-123', addedBy: 'user-456' };

        await service.enqueueFavorite(dto);

        expect(SendMessageCommand).toHaveBeenCalledTimes(1);
        expect(sqsClientSendMock).toHaveBeenCalledTimes(1);

        const sentCommand = (SendMessageCommand as unknown as jest.Mock).mock.calls[0][0];
        expect(sentCommand.QueueUrl).toBe('https://queue-url');

        const body = JSON.parse(sentCommand.MessageBody);
        expect(body.type).toBe('AddFavorite');
        expect(body.authorId).toBe(dto.authorId);
        expect(body.addedBy).toBe(dto.addedBy);
        expect(body.timestamp).toBeDefined();
    });

    it('enqueueFavoriteRemoved should send RemoveFavorite message', async () => {
        const favoriteId = 'fav-789';
        const userId = 'user-456';

        await service.enqueueFavoriteRemoved(favoriteId, userId);

        expect(SendMessageCommand).toHaveBeenCalledTimes(1);
        expect(sqsClientSendMock).toHaveBeenCalledTimes(1);

        const sentCommand = (SendMessageCommand as unknown as jest.Mock).mock.calls[0][0];
        expect(sentCommand.QueueUrl).toBe('https://queue-url');

        const body = JSON.parse(sentCommand.MessageBody);
        expect(body.type).toBe('RemoveFavorite');
        expect(body.favoriteId).toBe(favoriteId);
        expect(body.userId).toBe(userId);
        expect(body.timestamp).toBeDefined();
    });
});
