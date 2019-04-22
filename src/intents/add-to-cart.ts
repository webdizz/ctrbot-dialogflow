import { Logger } from '@restify-ts/logger';
import { ProductLookupService } from '../service/product-lookup.service';
import { CartService } from '../service/cart.service';

export class AddToCartIntentHandler {

    constructor(private agent: WebhookClient, private log: Logger) { }

    /**
     *  Handles product lookup intent
     */
    public handleAddToCart() {
        return async () => {
            let intentContextParams = this.agent.contexts[0].parameters;
            let productDetails = intentContextParams['ctc-product'];

            if (productDetails.toLowerCase().includes('ok') || productDetails.toLowerCase().includes('thank')) {
                // lets close product lookup intent
                this.agent.add('My pleasure!');
                this.agent.clearOutgoingContexts();
            } else {
                try {
                    const productLookupResponse = await ProductLookupService.getProductSuggestions(productDetails);
                    //Hardcoded selected first item
                    const productCode = this.getProductCodeToOrder(productLookupResponse.products, 0);
                    const addToCartResponse = await CartService.addToCart(productCode);
                    this.handleAddToCartResponse(addToCartResponse, productCode);
                } catch (error) {
                    this.log.error(error);
                    this.agent.add(`I'm really sorry, but something wrong happened when I tried to order a product '${productDetails}' ;(`);
                }
            }
        }
    }

    private getProductCodeToOrder(products: any[], index: number): string {
        return products[index].productCode.replace('P', '');
    } 

    private handleAddToCartResponse(response: any, productToOrder: string): void {
        if (response.status === 'success') {
            const cartId = response.cartId;
            this.agent.add(`I ordered for you product '${productToOrder}'. Your order code is '${cartId}'`);
        } else {
            this.agent.add(`Sorry, I'm' unable to order '${productToOrder}' at the moment.`);
        }
    }
}
