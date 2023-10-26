const {
    SUCCESS_STATUS_CODE,
    CREATE_STATUS_CODE,
    BAD_REQUEST_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
} = require("../../config");
const { logger } = require("../../logger");
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY)

const RetriveProduct = async (req, res) => {
    try {
        const getStripePaymentProduct = await stripe.prices.list({
            product: process.env.REACT_APP_STRIPE_PRODUCTID
        })

        if (!getStripePaymentProduct) {
            logger.info(
                `STRIPE PRODUCT LOG - Status: ${NOT_FOUND_STATUS_CODE} - Message: No Product Found`
            );
            throw {
                status: NOT_FOUND_STATUS_CODE,
                message: "No Product found.",
            };
        }

        return res.status(SUCCESS_STATUS_CODE).json({ productDetails: getStripePaymentProduct.data })

    } catch (error) {
        logger.error(
            `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
        );
        return res.status(NOT_FOUND_STATUS_CODE).json({ message: error.message });
    }
}

const CreateSubscription = async (req, res) => {

    try {

        const subscription = await stripe.subscriptions.create({
            customer: req.body.customerId,
            items: [
                {
                    price: req.body.priceId
                }
            ],
            payment_behavior:'default_incomplete',
            payment_settings:{ 'save_default_payment_method': 'on_subscription' },
            expand:['latest_invoice.payment_intent']
        })

        if (!subscription) {
            logger.info(
                `SUBSCRIPTION LOG - Status: ${NOT_FOUND_STATUS_CODE} - Message: Unable to create subscription`
            );
            throw {
                status: NOT_FOUND_STATUS_CODE,
                message: "Unable to create subscription",
            };
        }

        return res.status(CREATE_STATUS_CODE).json({ message: "Subscription Created Successfully", data: subscription })

    } catch (error) {
        logger.error(
            `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
        );
        return res.status(NOT_FOUND_STATUS_CODE).json({ message: error.message });
    }

}

module.exports = { RetriveProduct, CreateSubscription }