import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';
import { ProductsItem } from '../product/res/products.item';

@Injectable()
export class SteamService {
  constructor(private readonly httpService: HttpService) {}

  async findProduct(productName: string): Promise<ProductsItem> {
    try {
      return await this.searchProductByName(productName);
    } catch (e) {}
  }

  async searchProductByName(productName: string): Promise<ProductsItem> {
    const productForUrl = productName.toLocaleLowerCase().split(' ').join('+');
    const searchProducts = await this.httpService.axiosRef.get<string>(
      `https://store.steampowered.com/search/suggest?term=${productForUrl}&f=games&cc=PL&realm=1&l=polish&v=17387031&excluded_content_descriptors%5B%5D=3&excluded_content_descriptors%5B%5D=4&use_store_query=1&use_search_spellcheck=1`,
    );

    const firstProduct = new JSDOM(
      searchProducts.data,
    ).window.document.querySelector<HTMLAreaElement>('.match.ds_collapse_flag');
    const productTitle =
      firstProduct.querySelector<HTMLElement>('.match_name').textContent;
    const productImg =
      firstProduct.querySelector<HTMLImageElement>('.match_img img').src;
    const productPrice = firstProduct
      .querySelector<HTMLElement>('.match_price')
      .textContent.slice(0, -2)
      .replace(',', '');

    return {
      siteName: 'Steam',
      productPrice: productPrice === 'Fr' ? '000' : productPrice,
      productTitle,
      productImg,
      productStoreUrl: firstProduct.href,
    };
  }
}
