import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { EventClientService } from './event.client';

@Controller('event')
export class EventProxyController {
  constructor(private readonly eventClient: EventClientService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR')
  @Post('create')
  async createEvent(@Body() body: any) {
    console.log('[Gateway] sending event_create...', body);
    const res = await this.eventClient.createEvent(body);
    console.log('[Gateway received]', res);
    return res;
  }

  @Get()
  async listEvents() {
    console.log('[Gateway] sending event_list...');
    const res = await this.eventClient.listEvents();
    console.log('[Gateway received]', res);
    return res;
  }

  @Get(':id')
  async getEventDetail(@Param('id') id: string) {
    console.log('[Gateway] sending event_detail...', id);
    const res = await this.eventClient.getEventDetail(id);
    console.log('[Gateway received]', res);
    return res;
  }
}
