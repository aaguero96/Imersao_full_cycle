import { ListCreatedEvent } from './events/list-created.event';
import { ListGatewayInMemory } from './gateways/list-gateway-in-memory';
import { ListsService } from './lists.service';

describe('ListsService', () => {
  let service: ListsService;
  let listPersistenceGateway: ListGatewayInMemory;
  const eventEmitterMock = {
    emit: jest.fn(),
  };

  // Gerar o service antes de cada teste
  beforeEach(async () => {
    listPersistenceGateway = new ListGatewayInMemory();
    service = new ListsService(listPersistenceGateway, eventEmitterMock as any);
  });

  it('Deve criar uma lista', async () => {
    const list = await service.create({
      name: 'my list',
    });
    expect(listPersistenceGateway.items).toContain(list);
    expect(eventEmitterMock.emit).toHaveBeenCalled();
    expect(eventEmitterMock.emit).toHaveBeenCalledWith(
      'list.created',
      new ListCreatedEvent(list),
    );
  });
});
