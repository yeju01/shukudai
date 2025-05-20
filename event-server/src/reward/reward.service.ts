import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRewardDto } from 'src/dto/createReward.dto';
import { Event } from 'src/schema/event.schema';
import { Reward } from 'src/schema/reward.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<Reward>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  async createReward(dto: CreateRewardDto): Promise<Reward> {
    const { name, description, type, amount, eventId } = dto;

    const exists = await this.rewardModel.exists({ name });
    if (exists) {
      throw new RpcException('이미 존재하는 리워드');
    }

    const newReward = new this.rewardModel({
      name,
      description,
      type,
      amount,
      eventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await newReward.save();
  }

  async listRewards(): Promise<Reward[]> {
    return await this.rewardModel.find().exec();
  }

  async deleteReward(id: string): Promise<Reward | null> {
    const reward = await this.rewardModel.findById(id).exec();
    if (!reward) {
      throw new RpcException('해당 리워드 없음');
    }

    const events = await this.eventModel.find({ rewardIds: id }).exec();
    if (events.length > 0) {
      throw new RpcException('이벤트에서 사용중인 리워드라 삭제 불가능');
    }

    return await this.rewardModel.findByIdAndDelete(id).exec();
  }
}
