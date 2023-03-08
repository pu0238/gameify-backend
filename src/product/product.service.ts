import { Injectable, Query } from '@nestjs/common';
import { ProductsRes } from './res/products.respond';
import { SteamService } from '../steam/steam.service';
import { KinguinService } from '../kinguin/kinguin.service';
import { G2AService } from '../g2a/g2a.service';
import { EnebaService } from '../eneba/eneba.service';
import { GogService } from '../gog/gog.service';
import { ProductsProposed } from './res/products.proposed';

@Injectable()
export class ProductService {
  constructor(
    private readonly steamService: SteamService,
    private readonly kinguinService: KinguinService,
    private readonly g2aService: G2AService,
    private readonly enebaService: EnebaService,
    private readonly gogService: GogService,
  ) {}

  async getProducts(itemName: string): Promise<ProductsRes> {
    const allProductsFromSites = await Promise.all([
      this.steamService.findProduct(itemName),
      this.kinguinService.findProduct(itemName),
      this.g2aService.findProduct(itemName),
      this.enebaService.findProduct(itemName),
      this.gogService.findProduct(itemName),
    ]);
    const products = allProductsFromSites.filter((product) => product != null);
    return {
      currency: 'PLN',
      products,
    };
  }

  async getProposedProducts(quantity: number): Promise<ProductsProposed[]> {
    return await this.enebaService.getProposedProducts(quantity);
  }

  async searchManyProductByName(
    productName: string,
  ): Promise<ProductsProposed[]> {
    return await this.g2aService.searchManyProductByName(productName);
  }
}
