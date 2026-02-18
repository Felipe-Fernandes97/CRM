import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegotiationsService } from './negotiations.service';
import { NegotiationsController } from './negotiations.controller';
import { Negotiation } from './entities/negotiations.entity';
import { NegotiationsSeedService } from './negotiations-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Negotiation])],
  controllers: [NegotiationsController],
  providers: [NegotiationsService, NegotiationsSeedService],
  exports: [NegotiationsService],
})
export class NegotiationsModule {}
