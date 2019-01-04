import * as request from 'request-promise-native'

class OrderTrackingIntentHandler {
    constructor() { }

    async handleOrderTracking(agent: WebhookClient) {
        let intentContextParams = agent.contexts[0].parameters
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
        const response = await request.post(options)

        agent.add(`Hello, your order '${orderNumber}' status is '${response.status}' and will arrive at ${response.products['order.status.inprogress'][0].eta}`)
    }

}

export { OrderTrackingIntentHandler }