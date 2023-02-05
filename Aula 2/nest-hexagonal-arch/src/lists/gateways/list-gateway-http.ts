import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { List } from '../entities/list.entity';
import { ListGatewayInterface } from './list-gateway-interface';

@Injectable()
export class ListGatewayHttp implements ListGatewayInterface {
  constructor(
    @Inject(HttpService)
    private httpService: HttpService,
  ) {}

  async create(list: List): Promise<List> {
    const response = await lastValueFrom(
      this.httpService.post('lists', {
        name: list.name,
      }),
    );
    list.id = response.data.id;
    return list;
  }

  async findAll(): Promise<List[]> {
    const response = await lastValueFrom(this.httpService.get('lists'));
    return response.data.map((list) => new List(list.name, list.id));
  }

  async findById(id: number): Promise<List> {
    const { data } = await lastValueFrom(this.httpService.get(`lists/${id}`));
    return new List(data.name, data.id);
  }
}
