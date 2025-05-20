import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { CreateEventDto } from 'src/dto/createEvent.dto';
import { UpdateEventDto } from 'src/dto/updateEvent.dto';
import { StatusType } from 'src/enum/statusType.enum';
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
      throw new RpcException('이벤트 중복');
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

  async updateEvent(dto: UpdateEventDto): Promise<Event> {
    const { eventId, statusType } = dto;

    if (!isValidObjectId(eventId)) {
      throw new RpcException('잘못된 이벤트 ID 형식');
    }

    const event = await this.eventModel.findByIdAndUpdate(
      eventId,
      { status: statusType },
      { new: true },
    );

    if (!event) {
      throw new RpcException('이벤트 없음');
    }

    return event;
  }

  async listEvents(): Promise<Event[]> {
    return await this.eventModel.find().exec();
  }

  async getEventById(id: string): Promise<Event | null> {
    if (!isValidObjectId(id)) {
      throw new RpcException('잘못된 ID 형식');
    }

    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new RpcException('이벤트 없음');
    }

    return event;
  }
}
