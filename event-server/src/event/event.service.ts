import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from 'src/dto/createEvent.dto';
import { Event } from 'src/schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}
  async createEvent(dto: CreateEventDto): Promise<Event> {
    const {
      name,
      description,
      conditionType,
      conditionPayload,
      startAt,
      endAt,
      rewardIds,
    } = dto;

    const exists = await this.eventModel.exists({ name });
    if (exists) {
      throw new Error('Event already exists');
    }

    const newEvent = new this.eventModel({
      name,
      description,
      conditionType,
      conditionPayload,
      startAt,
      endAt,
      status: 'INACTIVE',
      rewardIds,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await newEvent.save();
  }

  async listEvents(): Promise<Event[]> {
    return await this.eventModel.find().exec();
  }

  async getEventById(id: string): Promise<Event | null> {
    return await this.eventModel.findById(id).exec();
  }
}
