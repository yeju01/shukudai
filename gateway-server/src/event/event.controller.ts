import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
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
    try {
      console.log('[Gateway] sending event_create...', body);
      const res = await this.eventClient.createEvent(body);
      console.log('[Gateway received]', res);
      return res;
    } catch (error) {
      if (error.message === '잘못된 이벤트 형식') {
        console.error('[Gateway] Invalid event format', error);
        throw new BadRequestException('잘못된 이벤트 형식');
      }
      if (error.message === '이벤트 중복') {
        console.error('[Gateway] Event already exists', error);
        throw new ConflictException('이벤트 중복');
      }

      console.log('[Gateway] Event creation failed', error);
      throw new InternalServerErrorException('이벤트 생성 실패');
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async listEvents() {
    try {
      console.log('[Gateway] sending event_list...');
      const res = await this.eventClient.listEvents();
      console.log('[Gateway received]', res);
      return res;
    } catch (error) {
      console.error('[Gateway] Event list retrieval failed', error);
      throw new InternalServerErrorException('이벤트 목록 조회 실패');
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN')
  async getEventDetail(@Param('id') id: string) {
    try {
      console.log('[Gateway] sending event_detail...', id);
      const res = await this.eventClient.getEventDetail(id);
      console.log('[Gateway received]', res);
      return res;
    } catch (error) {
      if (error.message === '잘못된 ID 형식') {
        console.error('[Gateway] Invalid ID format', error);
        throw new BadRequestException('잘못된 ID 형식');
      }
      if (error.message === '이벤트 없음') {
        console.error('[Gateway] Event not found', error);
        throw new NotFoundException('이벤트 없음');
      }

      console.error('[Gateway] Event detail retrieval failed', error);
      throw new InternalServerErrorException('id로 이벤트 조회 실패');
    }
  }
}
