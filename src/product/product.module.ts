import { GogModule } from './../gog/gog.module';
import { EnebaModule } from './../eneba/eneba.module';
import { KinguinModule } from './../kinguin/kinguin.module';
import { SteamModule } from './../steam/steam.module';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { G2AModule } from '../g2a/g2a.module';

@Module({
  imports: [SteamModule, KinguinModule, G2AModule, EnebaModule, GogModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
