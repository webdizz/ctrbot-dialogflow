import { Logger } from '@restify-ts/logger';
import { CartService } from '../service/cart.service';
import { Card } from 'dialogflow-fulfillment';
import { ContextService } from '../service/context.service';

export class ViewCartIntentHandler {

    constructor(private agent: WebhookClient, private log: Logger) { }

    /**
     *  Handles View cart intent
     */
    public handleViewCart() {
        return async () => {
            const cartId = ContextService.getCartIdFromContext(this.agent);
            if (cartId) {
                try {
                    const getCartResponse = await CartService.getCart(cartId);
                    this.handleViewCartResponse(getCartResponse); 
                } catch (error) {
                    this.log.error(error);
                    this.agent.add(`I'm really sorry, but something wrong happened when I tried obtain info about your cart ;(`);
                }
            } else {
                this.agent.add(`Sorry, you have not added any products yet.`);
            }
        }
    }

    private handleViewCartResponse(response: any): void {
        ContextService.saveCartId(response.cartId, this.agent);

        this.agent.add(`Here is your current cart:`);
        for (let product of response.products) {
            let productCode = product.productCode.replace('P', '')
            const S7_BASE_URL = process.env['S7_BASE_URL'] as string;
            let imgUrl = `${S7_BASE_URL}${productCode}_1`;
            let card = this.createCard(product.productName, product.quantity, imgUrl);
            this.agent.add(card);
        }
    }

    private createCard(title: string, quantity: number, imageUrl: string): Card {
        return new Card({ title: `${title} - ${quantity} item(s)`, imageUrl: imageUrl});
    }
}
