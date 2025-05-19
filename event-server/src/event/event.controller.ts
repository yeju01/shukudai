import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateEventDto } from 'src/dto/createEvent.dto';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern('event_create')
  async createEvent(@Payload() dto: CreateEventDto) {
    console.log('[Event received create]', dto);
    return await this.eventService.createEvent(dto);
  }

  @MessagePattern('event_list')
  async listEvents() {
    console.log('[Event received list]');
    return await this.eventService.listEvents();
  }

  @MessagePattern('event_detail')
  async getEventById(@Payload() id: string) {
    console.log('[Event received detail]', id);
    return await this.eventService.getEventById(id);
  }
}
