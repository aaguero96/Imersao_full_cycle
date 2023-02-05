import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull/dist/bull.module';
import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize/dist';
import { ListModel } from './entities/list.model';
import { ListGatewayHttp } from './gateways/list-gateway-http';
import { ListGatewaySequelize } from './gateways/list-gateway-sequelize';
import { CreateListInCRMJob } from './jobs/create-list-in-crm.job';
import { CreateListInCRMListener } from './listeners/create-list-in-crm.listener';
import { PublishListCreatedListener } from './listeners/publish-list-created';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ListModel]),
    HttpModule.register({
      baseURL: 'http://localhost:8000',
    }),
    BullModule.registerQueue({
      name: 'default',
      defaultJobOptions: {
        attempts: 3,
      },
    }),
  ],
  controllers: [ListsController],
  providers: [
    ListsService,
    ListGatewaySequelize,
    ListGatewayHttp,
    CreateListInCRMListener,
    PublishListCreatedListener,
    CreateListInCRMJob,
    {
      provide: 'ListPersistenceGateway',
      useExisting: ListGatewaySequelize,
    },
    {
      provide: 'ListIntegrationGateway',
      useExisting: ListGatewayHttp,
    },
    {
      provide: 'EventEmitter',
      useExisting: EventEmitter2,
    },
  ],
})
export class ListsModule {}
