import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { ListCreatedEvent } from '../events/list-created.event';

@Injectable()
export class PublishListCreatedListener {
  constructor(
    @InjectQueue('default') // fila registrada no root module
    private queue: Queue,
  ) {}

  @OnEvent('list.created')
  async handle(event: ListCreatedEvent) {
    await this.queue.add('list.created', event);
  }
}
