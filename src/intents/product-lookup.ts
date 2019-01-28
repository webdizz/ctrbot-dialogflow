import * as request from 'request-promise-native'
import { Logger } from '@restify-ts/logger';
import { Card, CardButton } from 'dialogflow-fulfillment'

export class ProductLookupIntentHandler {

    constructor(private agent: WebhookClient, private log: Logger) { }

    /**
     *  Handles product lookup intent
     */
    public handleProductLookup() {
        return async () => {
            let intentContextParams = this.agent.contexts[0].parameters
            let productDetails = intentContextParams['ctc-product']

            const ENDPOINT_PRODUCT_LOOKUP = process.env['ENDPOINT_PRODUCT_LOOKUP'] as string
            let options = {
                uri: ENDPOINT_PRODUCT_LOOKUP,
                qs: {
                    site: 'ct',
                    format: 'json',
                    count: '4',
                    q4: productDetails,
                },
                json: true
            }
            await request.get(options)
                .then((response) => {
                    this.handleProductLookupResponse(response, productDetails)
                }).catch(error => {
                    this.log.error(error)
                    this.agent.add(`I'm really sorry, but something wrong happened when I tried to find a product '${productDetails}' ;(`)
                })
        }
    }

    private createCard(title: string, imageUrl: string, productUrl: string) {
        // let cardBtn = new CardButton({ postback: productUrl, text: title })
        return new Card({ title: title, imageUrl: imageUrl, buttons: [{ postback: productUrl, text: title }] })
    }

    private handleProductLookupResponse(response: any, productDetails: string) {
        if (Number(response.query['total-results']) > 0) {
            this.agent.add(`Hello, please take a look what I was able to find for '${productDetails}':`)

            for (let item of response.results) {
                let product = item.field
                let productUrl = product['short-pdp-url']
                this.agent.add(this.createCard(product['prod-name'], product['thumb-img-url'], productUrl))
            }
        } else {
            this.agent.add(`I'm really sorry, was able to find something related to '${productDetails}':`)
        }
    }

}