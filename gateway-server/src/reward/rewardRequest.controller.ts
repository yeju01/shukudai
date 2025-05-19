import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom } from 'rxjs';
import { RewardRequestQueryDto } from 'src/dto/rewardRequest.query.dto';
import { Roles } from 'src/role/role.decorator';
import { RolesGuard } from 'src/role/role.guard';
import { User } from 'src/user/user.decorator';
import { UserPayload } from 'src/user/userPayload.interface';

@Controller('reward/request')
export class RewardRequestController {
  constructor(
    @Inject('REWARD_REQUEST_SERVICE')
    private readonly rewardClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  async createRewardRequest(
    @Body('eventId') eventId: string,
    @User() user: UserPayload,
  ) {
    try {
      const userId = user.userId;
      await lastValueFrom(
        this.rewardClient.send('reward_request_create', {
          userId,
          eventId,
        }),
      );
    } catch (error) {
      if (error.message === '이벤트 없음') {
        console.error('[Gateway] Event not found', error);
        throw new NotFoundException('이벤트 없음');
      }
      if (error.message === '잘못된 보상 요청 형식') {
        console.error('[Gateway] Invalid reward request format', error);
        throw new BadRequestException('잘못된 보상 요청 형식');
      }
      if (error.message === '보상 중복 요청') {
        console.error('[Gateway] Already requested reward', error);
        throw new ConflictException('보상 중복 요청');
      }

      console.error('[Gateway] Error creating reward request', error);
      throw new InternalServerErrorException('보상 요청 생성 중 오류가 발생');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('USER')
  async getRewardRequest(@User() user: UserPayload) {
    try {
      const userId = user.userId;
      return this.rewardClient.send('reward_request_findByUserId', userId);
    } catch (error) {
      console.error('[Gateway] Error fetching reward request', error);
      throw new InternalServerErrorException('보상 요청 조회 중 오류가 발생');
    }
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('OPERATOR', 'ADMIN', 'AUDITOR')
  async getAllRewardRequest(@Query() filter?: RewardRequestQueryDto) {
    try {
      return this.rewardClient.send('reward_request_findAll', filter); //note: 연결쪽 확인
    } catch (error) {
      console.error('[Gateway] Error fetching all reward requests', error);
      throw new InternalServerErrorException(
        '모든 보상 요청 조회 중 오류가 발생',
      );
    }
  }
}
