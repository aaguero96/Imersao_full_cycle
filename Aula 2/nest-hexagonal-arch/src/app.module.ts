import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListModel } from './lists/entities/list.model';
import { ListsModule } from './lists/lists.module';

@Module({
  imports: [
    ListsModule,
    EventEmitterModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      host: ':memory:',
      models: [ListModel],
      autoLoadModels: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis', // nome do container (docker-container)
        port: 6379, // padrão do redis
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
