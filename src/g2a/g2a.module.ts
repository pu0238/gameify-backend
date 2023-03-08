import { Module } from '@nestjs/common';
import { G2AService } from './g2a.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [G2AService],
  exports: [G2AService],
})
export class G2AModule {}
