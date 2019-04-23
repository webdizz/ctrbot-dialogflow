import { Logger } from '@restify-ts/logger';
import { CartService } from '../service/cart.service';
import { ContextService } from '../service/context.service';

export class AddToCartIntentHandler {

    constructor(private agent: WebhookClient, private log: Logger) { }

    /**
     *  Handles product lookup intent
     */
    public handleAddToCart() {
        return async () => {
            const productCode = this.getProductCodeToOrder();
            if (productCode) {
                try {
                    const cartId = ContextService.getCartIdFromContext(this.agent);
                    let addToCartResponse;
                    if (cartId) {
                        addToCartResponse = await CartService.addToExistingCart(productCode, cartId);
                    } else {
                        addToCartResponse = await CartService.addToNewCart(productCode);
                    }
                    this.handleAddToCartResponse(addToCartResponse, productCode);
                } catch (error) {
                    this.log.error(error);
                    this.agent.add(`I'm really sorry, but something wrong happened when I tried to order a product '${productCode}' ;(`);
                }
            }
        }
    }

    private getProductCodeToOrder(): string | undefined {
        const searchResultsContext = ContextService.getContextByName('search-results', this.agent);
        if (!searchResultsContext) {
            return undefined;
        }
        const parameters = searchResultsContext.parameters;
        const products: string[] = parameters['products'].split(',');
        const index: number = +parameters['number'];
        if (products[index - 1]) {
            return products[index - 1].replace('P', '');
        } else {
            this.agent.add(`Sorry, there is only ${products.length} options.`);
            return undefined;
        }
    }

    private handleAddToCartResponse(response: any, productToOrder: string): void {
        if (response.status === 'success') {
            const cartId = response.cartId;
            this.agent.add(`I ordered for you product '${productToOrder}'. Your order code is '${cartId}'`);
            ContextService.saveCartId(cartId, this.agent);
        } else {
            this.agent.add(`Sorry, I'm' unable to order '${productToOrder}' at the moment.`);
        }
    }
}
