import { Logger } from '@restify-ts/logger';
import { Card, Suggestion } from 'dialogflow-fulfillment'
import { ProductLookupService } from '../service/product-lookup.service';

export class ProductLookupIntentHandler {

    constructor(private agent: WebhookClient, private log: Logger) { }

    /**
     *  Handles product lookup intent
     */
    public handleProductLookup() {
        return async () => {
            let intentContextParams = this.agent.contexts[0].parameters;
            let productDetails = intentContextParams['ctc-product'];

            if (productDetails.toLowerCase().includes('ok') || productDetails.toLowerCase().includes('thank')) {
                // lets close product lookup intent
                this.agent.add('My pleasure!');
                this.agent.clearOutgoingContexts();
            } else {
                try {
                    const response = await ProductLookupService.getProductSuggestions(productDetails);
                    this.handleProductLookupResponse(response, productDetails);
                } catch (error) {
                    this.log.error(error);
                    this.agent.add(`I'm really sorry, but something wrong happened when I tried to find a product '${productDetails}' ;(`);
                }
            }
        }
    }
    
    private createCard(title: string, imageUrl: string, productUrl: string): Card {
        const SITE_BASE_URL = process.env['SITE_BASE_URL'] as string
        let card = new Card({ title: title, imageUrl: imageUrl })
        card.setButton({ text: 'Go for product', url: SITE_BASE_URL + productUrl })
        return card
    }

    private handleProductLookupResponse(response: any, productDetails: string) {
        if (response.products.length > 0) {
            const productCodes: string = response.products.map((product: any) => product.productCode.replace('P', '')).join(',');
            
            this.agent.setContext({
                name: 'search-results',
                lifespan: 2,
                parameters: {products: productCodes}
            });

            //this.agent.add(`Hello, please take a look what I was able to find for '${productDetails}':`)
            for (let product of response.products) {
                let productUrl = product.searchLink
                let productCode = product.productCode.replace('P', '')
                const S7_BASE_URL = process.env['S7_BASE_URL'] as string
                let imgUrl = `${S7_BASE_URL}${productCode}_1`
                let card = this.createCard(product.label, imgUrl, productUrl)
                this.agent.add(card)
            }
            this.agent.add(new Suggestion('Thanks!'))
        } else {
            this.agent.add(`I'm really sorry, was able to find something related to '${productDetails}':`)
        }
    }

}