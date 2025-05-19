import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRewardRequestDto } from 'src/dto/createRewardRequest.dto';
import { Event } from 'src/schema/event.schema';
import { RewardRequest } from 'src/schema/rewardRequest.schema';
import { UserAction } from 'src/schema/userAction.schema';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name)
    private readonly rewardRequestModel: Model<RewardRequest>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
    @InjectModel(UserAction.name)
    private readonly userActionModel: Model<UserAction>,
  ) {}

  async createRewardRequest(
    dto: CreateRewardRequestDto,
  ): Promise<RewardRequest> {
    const { userId, eventId } = dto;

    const exists = await this.rewardRequestModel.exists({
      userId,
      eventId,
    });
    if (exists) {
      throw new Error('Reward request already exists');
    }

    const event = await this.eventModel.findById<Event>(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const now = new Date();
    if (now < event.startAt || now > event.endAt) {
      return this.rewardRequestModel.create({
        userId,
        eventId,
        status: 'REJECTED',
        reason: '이벤트 기간 아님',
      });
    }

    const valid = await this.checkCondition(
      userId,
      event.conditionType,
      event.conditionPayload,
    );
    const status = valid ? 'GRANTED' : 'REJECTED';

    return this.rewardRequestModel.create({
      userId,
      eventId,
      status,
      grantedAt: valid ? now : undefined,
      reason: valid ? '조건 충족' : '조건 미충족',
    });
  }

  // note: 조건 확인, 쿼리로하기, level은 유저가 가지고 있게 하기
  async checkCondition(
    userId: string,
    type: string,
    payload: any,
  ): Promise<boolean> {
    switch (type) {
      case 'LEVEL': {
        const actions = await this.userActionModel.find({
          userId,
          type: 'level_up',
        });
        const latest = actions.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        )[0];
        return latest?.meta?.level >= payload.amount;
      }
      case 'ATTENDANCE': {
        const logs = await this.userActionModel.find({ userId, type: 'login' });
        const uniqueDays = new Set(
          logs.map((log) => log.createdAt.toISOString().slice(0, 10)),
        );
        return uniqueDays.size >= payload.days;
      }

      case 'QUEST': {
        const logs = await this.userActionModel.find({
          userId,
          type: 'quest_clear',
        });
        return logs.some((l) => l.meta?.questId === payload.questId);
      }

      case 'BOSS_CLEAR': {
        const logs = await this.userActionModel.find({
          userId,
          type: 'boss_clear',
        });
        return logs.some((l) => l.meta?.bossId === payload.bossId);
      }

      default:
        return false;
    }
  }
}
