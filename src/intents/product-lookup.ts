import * as request from 'request-promise-native'
import { Logger } from '@restify-ts/logger';
import { Card, Suggestion } from 'dialogflow-fulfillment'

export class ProductLookupIntentHandler {

    constructor(private agent: WebhookClient, private log: Logger) { }

    /**
     *  Handles product lookup intent
     */
    public handleProductLookup() {
        const ENDPOINT_PRODUCT_LOOKUP = process.env['ENDPOINT_PRODUCT_LOOKUP'] as string
        return async () => {
            let intentContextParams = this.agent.contexts[0].parameters
            let productDetails = intentContextParams['ctc-product']

            if (productDetails.toLowerCase().includes('ok') || productDetails.toLowerCase().includes('thank')) {
                // lets close product lookup intent
                this.agent.add('My pleasure!')
                this.agent.clearOutgoingContexts()
            } else {
                let options = {
                    uri: ENDPOINT_PRODUCT_LOOKUP,
                    qs: {
                        q: productDetails,
                    },
                    json: true
                }
                await request.get(options)
                    .then((response) => {
                        this.handleProductLookupResponse(response, productDetails);
                        return response;
                    })
                    .then((response) => {
                        return this.addToCart(response);   
                    })
                    .catch(error => {
                        this.log.error(error)
                        this.agent.add(`I'm really sorry, but something wrong happened when I tried to find a product '${productDetails}' ;(`)
                    })
            }
        }
    }

    private addToCart(response: any): Promise<void> | void {
        const ENDPOINT_ADD_TO_CART = process.env['ENDPOINT_ADD_TO_CART'] as string
        if (response.products.length) {
            const productToOrder = response.products[0].productCode.replace('P', '')
            let options = {
                uri: ENDPOINT_ADD_TO_CART,
                qs: {
                    lang: 'en',
                    store: '0100'
                },
                body: {
                    code:productToOrder,
                    quantity:'1',
                    skuDeliveryMode:'PAY_AND_PICKUP'
                },
                json: true,
                strictSSL: false
            }
            return request.post(options)
                .then((response)=>this.handleAddToCartResponse(response, productToOrder))
                .catch(error => {
                    this.log.error(error)
                    this.agent.add(`I'm really sorry, but something wrong happened when I tried to order a product '${productToOrder}' ;(`)
                })
        }
    }

    private handleAddToCartResponse(response: any, productToOrder: string): void {
        if (response.status === 'success') {
            const cartId = response.cartId
            this.agent.add(`I ordered for you product '${productToOrder}'. Your order code is '${cartId}'`)
        } else {
            this.agent.add(`Sorry, I'm' unable to order '${productToOrder}' at the moment.`)
        }
    }

    private createCard(title: string, imageUrl: string, productUrl: string) {
        const SITE_BASE_URL = process.env['SITE_BASE_URL'] as string
        let card = new Card({ title: title, imageUrl: imageUrl })
        card.setButton({ text: 'Go for product', url: SITE_BASE_URL + productUrl })
        return card
    }

    private handleProductLookupResponse(response: any, productDetails: string) {
        if (response.products.length > 0) {
            this.agent.add(`Hello, please take a look what I was able to find for '${productDetails}':`)
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