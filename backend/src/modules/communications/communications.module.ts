import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationsService } from './communications.service';
import { CommunicationsController } from './communications.controller';
import { Communication } from './entities/communication.entity';
import { CommunicationsSeedService } from './communications-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Communication])],
  controllers: [CommunicationsController],
  providers: [CommunicationsService, CommunicationsSeedService],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
