import * as request from 'request-promise-native'

export class CartService {

    public static addToCart(product: string) {
        const ENDPOINT_ADD_TO_CART = process.env['ENDPOINT_ADD_TO_CART'] as string;
        const options = {
            uri: ENDPOINT_ADD_TO_CART,
            qs: {
                lang: 'en',
                store: '0991'
            },
            body: {
                code: product,
                quantity: '1',
                skuDeliveryMode: 'PAY_AND_PICKUP'
            },
            json: true,
            strictSSL: false
        };

        return request.post(options);
    }
}
