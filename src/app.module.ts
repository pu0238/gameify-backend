import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { SteamModule } from './steam/steam.module';
import { KinguinModule } from './kinguin/kinguin.module';
import { G2AModule } from './g2a/g2a.module';
import { EnebaModule } from './eneba/eneba.module';
import { GogModule } from './gog/gog.module';


@Module({
  imports: [ProductModule, SteamModule, KinguinModule, G2AModule, EnebaModule, GogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
