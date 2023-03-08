import { Module } from '@nestjs/common';
import { GogService } from './gog.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GogService],
  exports: [GogService],
})
export class GogModule {}
