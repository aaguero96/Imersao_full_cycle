import { Inject, Injectable } from '@nestjs/common';
import EventEmitter from 'events';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { List } from './entities/list.entity';
import { ListCreatedEvent } from './events/list-created.event';
import { ListGatewayInterface } from './gateways/list-gateway-interface';

@Injectable()
export class ListsService {
  constructor(
    @Inject('ListPersistenceGateway')
    private listPersistenceGateway: ListGatewayInterface,
    @Inject('EventEmitter')
    private eventEmmiter: EventEmitter,
  ) {}

  async create(createListDto: CreateListDto) {
    const list = new List(createListDto.name);
    await this.listPersistenceGateway.create(list);
    this.eventEmmiter.emit('list.created', new ListCreatedEvent(list));
    return list;
  }

  findAll() {
    return this.listPersistenceGateway.findAll();
  }

  async findOne(id: number) {
    const list = await this.listPersistenceGateway.findById(id);
    if (!list) {
      throw new Error('List not found');
    }
    return list;
  }

  update(id: number, updateListDto: UpdateListDto) {
    console.log(updateListDto);
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
