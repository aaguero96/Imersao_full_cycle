import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { Job } from 'bull';
import { ListCreatedEvent } from '../events/list-created.event';
import { ListGatewayInterface } from '../gateways/list-gateway-interface';

@Processor()
export class CreateListInCRMJob {
  constructor(
    @Inject('ListIntegrationGateway')
    private listIntegrationGateway: ListGatewayInterface,
  ) {}

  @Process('list.created')
  async handle(job: Job<ListCreatedEvent>) {
    console.log('job processando...');
    const event = job.data;
    console.log(event);
    await this.listIntegrationGateway.create(event.list);
  }

  @OnQueueFailed({ name: 'list.created' })
  handleError(error: Error) {
    console.log('error', error);
  }
}
