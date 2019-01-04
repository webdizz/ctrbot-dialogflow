import * as request from 'request-promise-native'
import { Logger } from '@restify-ts/logger';

export class OrderTrackingIntentHandler {

    constructor(private agent: WebhookClient, private log: Logger) { }

    /**
     *  Handles order tracking intent
     */
    public handleOrderTracking() {
        return async () => {
            let intentContextParams = this.agent.contexts[0].parameters
            let orderNumber = intentContextParams['order-number']
            let email = intentContextParams['order-email']

            const ENDPOINT_ORDER_DETAILS = process.env['ENDPOINT_ORDER_DETAILS'] as string
            let options = {
                uri: ENDPOINT_ORDER_DETAILS,
                body: {
                    orderId: orderNumber,
                    email: email
                },
                json: true
            }
            await request.post(options)
                .then((response) => {
                    this.handleOrderTrackingResponse(response, orderNumber)
                }).catch(error => {
                    this.log.error(error)
                    this.agent.add(`I'm really sorry, but something wrong happened when I tried to find your order '${orderNumber}' ;(`)
                })
        }
    }

    private handleOrderTrackingResponse(response: any, orderNumber: string) {
        let eta = this.formatEta(response.products['order.status.inprogress'][0].eta);
        this.agent.add(`Hello, your order '${orderNumber}' status is '${response.status}' and will arrive on ${eta}`)
    }

    private formatEta(etaOrigin: string) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        }
        return new Intl.DateTimeFormat('en-US', options).format(Date.parse(etaOrigin))
    }
}