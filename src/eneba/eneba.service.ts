import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ProductsItem } from '../product/res/products.item';
import { ProductsProposed } from '../product/res/products.proposed';

@Injectable()
export class EnebaService {
  constructor(private readonly httpService: HttpService) {}

  async findProduct(productName: string): Promise<ProductsItem> {
    try {
      return await this.searchProductByName(productName);
    } catch (e) {}
  }

  async searchProductByName(productName: string): Promise<ProductsItem> {
    const searchProducts = await this.httpService.axiosRef.post(
      `https://www.eneba.com/graphql/`,
      {
        operationName: 'QuickProductSearch',
        variables: {
          currency: 'PLN',
          context: { country: 'PL', region: 'poland', language: 'en' },
          text: productName,
          sort: 'POPULARITY_DESC',
          suggestCollection: true,
          suggestCategory: true,
          tests: [],
        },
        query:
          'query QuickProductSearch($text: String!, $currency: AvailableCurrencyType, $sort: SearchSortEnum, $suggestCollection: Boolean, $suggestCategory: Boolean, $context: ContextInput, $tests: [TestEnum]) {\n  quickSearch: search(first: 6, text: $text, searchType: QUICK_SEARCH, sortBy: $sort, suggestCollection: $suggestCollection, suggestCategory: $suggestCategory, context: $context, tests: $tests) {\n    results {\n      totalCount\n      totalCountRelation\n      edges {\n        node {\n          ...BasicProduct\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    popularSearches {\n      slug\n      text\n      type\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BasicProduct on Product {\n  shortId\n  name\n  slug\n  regions {\n    code\n    name\n    __typename\n  }\n  platform {\n    label\n    value\n    __typename\n  }\n  cover(size: 300) {\n    ...MultiSizeImage\n    __typename\n  }\n  coverMobile: cover(size: 95) {\n    ...MultiSizeImage\n    __typename\n  }\n  promotion {\n    available\n    __typename\n  }\n  isReleased\n  releasedAt\n  cheapestAuction {\n    ...PreferredOrCheapestAuction\n    __typename\n  }\n  wishItemCount\n  category\n  __typename\n}\n\nfragment PreferredOrCheapestAuction on Auction {\n  product {\n    slug\n    __typename\n  }\n  isAddableToCart\n  isInStock\n  price(currency: $currency) {\n    ...Money\n    __typename\n  }\n  isPreOrder\n  merchant {\n    slug\n    displayname\n    physicalReviews(first: 5, after: null) {\n      ...PhysicalReviewConnection\n      __typename\n    }\n    paymentAuthorizationTerm {\n      value\n      __typename\n    }\n    deliveryAuthorizationTerm {\n      value\n      __typename\n    }\n    __typename\n  }\n  discountLabelFromMsrp\n  msrp(currency: $currency) {\n    ...Money\n    __typename\n  }\n  promotionalDiscountLabel\n  promotionalDiscountLabelFromMsrp\n  promotionalPrice(currency: $currency) {\n    ...Money\n    __typename\n  }\n  flags\n  __typename\n}\n\nfragment Money on Money {\n  amount\n  currency\n  __typename\n}\n\nfragment PhysicalReviewConnection on PhysicalReviewConnection {\n  totalCount\n  edges {\n    node {\n      id\n      text\n      auto\n      rating\n      autoText\n      orderItemName\n      submittedAt\n      submittedDiff\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MultiSizeImage on MultiSizeImage {\n  src\n  src2x\n  src3x\n  srcTiny\n  __typename\n}\n',
      },
      { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } },
    );

    const firstProduct = searchProducts.data.data.quickSearch.results.edges[0];
    const productTitle = firstProduct.node.name;
    const productPrice =
      firstProduct.node.cheapestAuction.price.amount.toString();
    const productImg = firstProduct.node.cover.src;
    const productStoreUrl = `https://www.eneba.com/${firstProduct.node.slug}`;

    return {
      siteName: 'Eneba',
      productPrice,
      productTitle,
      productImg,
      productStoreUrl,
    };
  }

  async getProposedProducts(quantity = 5): Promise<ProductsProposed[]> {
    const randNum =
      Math.random().toString().slice(2) +
      Math.random().toString().slice(2) +
      Math.random().toString().slice(2);
    const proposed = await this.httpService.axiosRef.post(
      `https://www.eneba.com/graphql/`,
      {
        operationName: 'HomeRecombeeSuggestions',
        variables: {
          currency: 'PLN',
          context: { country: 'PL', region: 'poland', language: 'pl_PL' },
          tests: [],
          first: quantity,
          userId: randNum.slice(0, 33),
          scenario: 'DEFAULT',
        },
        query:
          'query HomeRecombeeSuggestions($context: ContextInput, $first: Int, $userId: String!, $itemId: String, $recommId: String, $currency: AvailableCurrencyType, $scenario: RecommendationScenarioEnum, $tests: [TestEnum]) {\n  recombeeRecommendedProducts(context: $context, first: $first, userIdentifier: $userId, productShortId: $itemId, recommId: $recommId, scenario: $scenario, tests: $tests) {\n    recommId\n    items {\n      edges {\n        node {\n          ...BasicProduct\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BasicProduct on Product {\n  shortId\n  name\n  slug\n  regions {\n    code\n    name\n    __typename\n  }\n  platform {\n    label\n    value\n    __typename\n  }\n  cover(size: 300) {\n    ...MultiSizeImage\n    __typename\n  }\n  coverMobile: cover(size: 95) {\n    ...MultiSizeImage\n    __typename\n  }\n  promotion {\n    available\n    __typename\n  }\n  isReleased\n  releasedAt\n  cheapestAuction {\n    ...PreferredOrCheapestAuction\n    __typename\n  }\n  wishItemCount\n  category\n  __typename\n}\n\nfragment PreferredOrCheapestAuction on Auction {\n  product {\n    slug\n    __typename\n  }\n  isAddableToCart\n  isInStock\n  price(currency: $currency) {\n    ...Money\n    __typename\n  }\n  isPreOrder\n  merchant {\n    slug\n    displayname\n    physicalReviews(first: 5, after: null) {\n      ...PhysicalReviewConnection\n      __typename\n    }\n    paymentAuthorizationTerm {\n      value\n      __typename\n    }\n    deliveryAuthorizationTerm {\n      value\n      __typename\n    }\n    __typename\n  }\n  discountLabelFromMsrp\n  msrp(currency: $currency) {\n    ...Money\n    __typename\n  }\n  promotionalDiscountLabel\n  promotionalDiscountLabelFromMsrp\n  promotionalPrice(currency: $currency) {\n    ...Money\n    __typename\n  }\n  flags\n  __typename\n}\n\nfragment Money on Money {\n  amount\n  currency\n  __typename\n}\n\nfragment PhysicalReviewConnection on PhysicalReviewConnection {\n  totalCount\n  edges {\n    node {\n      id\n      text\n      auto\n      rating\n      autoText\n      orderItemName\n      submittedAt\n      submittedDiff\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MultiSizeImage on MultiSizeImage {\n  src\n  src2x\n  src3x\n  srcTiny\n  __typename\n}\n',
      },
      { headers: { 'Accept-Encoding': 'gzip,deflate,compress' } },
    );
    const result =
      proposed.data.data.recombeeRecommendedProducts.items.edges.map(
        (product) => {
          const productTitle = product.node.name;
          const productImg = product.node.cover.src;
          const slug = product.node.slug;

          return {
            productTitle,
            productImg,
            slug,
          };
        },
      );
    return result;
  }
}
