import { Injectable } from '@nestjs/common';
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
      throw new Error('Reward already exists');
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

  //async listRewards(): Promise<Reward[]> {
  //  return await this.rewardModel.find().exec();
  //}

  //async getRewardById(id: string): Promise<Reward | null> {
  //  return await this.rewardModel.findById(id).exec();
  //}

  //async updateReward(dto: any): Promise<Reward | null> {
  //  const { id, name, description, type, payload } = dto;

  //  const reward = await this.rewardModel.findById(id).exec();
  //  if (!reward) {
  //    throw new Error('Reward not found');
  //  }

  //  reward.name = name;
  //  reward.description = description;
  //  reward.type = type;
  //  reward.payload = payload;
  //  reward.updatedAt = new Date();

  //  return await reward.save();
  //}
  //async deleteReward(id: string): Promise<Reward | null> {
  //  const reward = await this.rewardModel.findById(id).exec();
  //  if (!reward) {
  //    throw new Error('Reward not found');
  //  }

  //  const events = await this.eventModel.find({ rewardIds: id }).exec();
  //  if (events.length > 0) {
  //    throw new Error('Cannot delete reward, it is used in events');
  //  }

  //  return await this.rewardModel.findByIdAndDelete(id).exec();
  //}
}
