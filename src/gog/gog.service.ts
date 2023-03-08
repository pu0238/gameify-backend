import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProductsItem } from '../product/res/products.item';

@Injectable()
export class GogService {
  constructor(private readonly httpService: HttpService) {}

  async findProduct(productName: string): Promise<ProductsItem> {
    try {
      return await this.searchProductByName(productName);
    } catch (e) {}
  }

  async searchProductByName(productName: string): Promise<ProductsItem> {
    const productForUrl = productName.toLocaleLowerCase().split(' ').join('+');
    const searchProducts = await this.httpService.axiosRef.get(
      `https://catalog.gog.com/v1/catalog?countryCode=PL&currencyCode=PLN&limit=1&locale=pl-PL&order=desc:score&page=1&productType=in:game,pack,dlc,extras&query=like:${productForUrl}`,
    );

    const firstProduct = searchProducts.data.products[0];
    const productPrice = firstProduct.price.finalMoney.amount.replace('.', '');
    const productTitle = firstProduct.title;
    const productImg = firstProduct.coverVertical;
    const productStoreUrl = `https://www.gog.com/pl/games?query=${productName}&order=desc:score`;

    return {
      siteName: 'GOG',
      productPrice,
      productTitle,
      productImg,
      productStoreUrl,
    };
  }
}
