import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ItemQuery } from './dto/search.itemQuery.dto';
import { ProductsRes } from './res/products.respond';
import { ProductsProposed } from './res/products.proposed';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProductByName(@Query() query: ItemQuery): Promise<ProductsRes> {
    return await this.productService.getProducts(query.itemName);
  }

  @Get('proposed')
  async getProposedProducts(@Query('quantity') quantity: string) {
    return await this.productService.getProposedProducts(Number(quantity));
  }

  @Get('search')
  async searchProducts(@Query() query: ItemQuery): Promise<ProductsProposed[]> {
    return await this.productService.searchManyProductByName(query.itemName);
  }
}
