import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProductsItem } from '../product/res/products.item';

@Injectable()
export class KinguinService {
  constructor(private readonly httpService: HttpService) {}

  async findProduct(productName: string): Promise<ProductsItem> {
    try {
      return await this.searchProductByName(productName);
    } catch (e) {}
  }

  async searchProductByName(productName: string): Promise<ProductsItem> {
    const [searchProducts, plnPrice] = await Promise.all([
      this.httpService.axiosRef(
        `https://www.kinguin.net/services/library/api/v1/products/search?store=kinguin&phrase=${productName}&size=5&visible=1&sort=bestseller.total,DESC`,
        {
          headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        },
      ),
      this.getCurrency('PLN'),
    ]);

    const firstProduct = searchProducts.data._embedded.products[0];
    const productId = firstProduct.externalId;
    const productTitle = firstProduct.name;
    const productPriceEuro = firstProduct.price.lowestOffer;
    const productImg = firstProduct.imageUrl;
    const productStoreUrl = `https://www.kinguin.net/pl/category/${productId}`;
    const productPrice = Math.round(
      productPriceEuro * plnPrice.rate,
    ).toString();

    return {
      siteName: 'Kinguin',
      productPrice,
      productTitle,
      productImg,
      productStoreUrl,
    };
  }

  async getCurrency(currencySymbol: string) {
    return (
      await this.httpService.axiosRef(
        `https://www.kinguin.net/services/currency/api/v1/rates/${currencySymbol}`,
        {
          headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
        },
      )
    ).data;
  }
}
