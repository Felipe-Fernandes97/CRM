import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationsService } from './communications.service';
import { CommunicationsController } from './communications.controller';
import { Communication } from './entities/communication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Communication])],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
