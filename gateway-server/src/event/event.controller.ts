import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { EventClientService } from './event.client';

@Controller('event')
export class EventProxyController {
  constructor(private readonly eventClient: EventClientService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async createEvent(@Body() body: any) {
    const res = await this.eventClient.createEvent(body);
    return res;
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async updateEvent(@Body() body: any) {
    const res = await this.eventClient.updateEvent(body);
    return res;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async listEvents() {
    const res = await this.eventClient.listEvents();
    return res;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async getEventDetail(@Param('id') id: string) {
    const res = await this.eventClient.getEventDetail(id);
    return res;
  }
}
