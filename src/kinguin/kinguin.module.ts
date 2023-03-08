import { Module } from '@nestjs/common';
import { KinguinService } from './kinguin.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [KinguinService],
  imports: [HttpModule],
  exports: [KinguinService],
})
export class KinguinModule {}
