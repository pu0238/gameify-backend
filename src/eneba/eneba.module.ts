import { Module } from '@nestjs/common';
import { EnebaService } from './eneba.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [EnebaService],
  imports: [HttpModule],
  exports: [EnebaService],
})
export class EnebaModule {}
