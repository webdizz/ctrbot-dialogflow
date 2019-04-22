import * as request from 'request-promise-native'

export class ProductLookupService {

    public static getProductSuggestions(productDetails: string) {
        const ENDPOINT_PRODUCT_LOOKUP = process.env['ENDPOINT_PRODUCT_LOOKUP'] as string;
        const options = {
            uri: ENDPOINT_PRODUCT_LOOKUP,
            qs: {
                q: productDetails,
            },
            json: true
        };

        return request.get(options);
    }
}
