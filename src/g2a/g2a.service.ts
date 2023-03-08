import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProductsItem } from '../product/res/products.item';
import { ProductsProposed } from 'src/product/res/products.proposed';

@Injectable()
export class G2AService {
  constructor(private readonly httpService: HttpService) {}

  async findProduct(productName: string): Promise<ProductsItem> {
    try {
      return await this.searchProductByName(productName);
    } catch (e) {}
  }

  async searchProductByName(productName: string): Promise<ProductsItem> {
    const searchProducts = await this.httpService.axiosRef.get(
      `https://www.g2a.com/search/api/v3/suggestions?include\[\]=categories&itemsPerPage=1&phrase=${productName}&currency=PLN`,
    );

    const firstProduct = searchProducts.data.data.items[0];
    const productTitle = firstProduct.name;
    const productPrice = firstProduct.price.replace('.', '');
    const productImg = firstProduct.image?.sources[7]?.url;
    const productStoreUrl = `https://www.g2a.com/${firstProduct.href}`;

    return {
      siteName: 'G2A',
      productPrice,
      productTitle,
      productImg,
      productStoreUrl,
    };
  }

  async searchManyProductByName(
    productName: string,
  ): Promise<ProductsProposed[]> {
    const searchProducts = await this.httpService.axiosRef.get(
      `https://www.g2a.com/search/api/v3/suggestions?include\[\]=categories&itemsPerPage=5&phrase=${productName}&currency=PLN`,
    );

    const result = searchProducts.data.data.items.map((product) => {
      const productTitle = product.name;
      const productImg = product.image?.sources[7]?.url;
      const slug = product.slug;

      return {
        productTitle,
        productImg,
        slug,
      };
    });
    return result;
  }
}
