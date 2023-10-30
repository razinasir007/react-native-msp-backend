const {
    SUCCESS_STATUS_CODE,
    CREATE_STATUS_CODE,
    BAD_REQUEST_STATUS_CODE,
    NOT_FOUND_STATUS_CODE,
} = require("../../config");
const { logger } = require("../../logger");
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY)
const endpointsecret = process.env.REACT_APP_STRIPE_ENDPOINT_SECRET_KEY

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
            payment_behavior: 'default_incomplete',
            payment_settings: { 'save_default_payment_method': 'on_subscription' },
            expand: ['latest_invoice.payment_intent']
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

        return res.status(CREATE_STATUS_CODE).json({ message: "Subscription Created Successfully", clientSecret: subscription.latest_invoice.payment_intent.client_secret })

    } catch (error) {
        logger.error(
            `ERROR LOG - Status: ${error.status} - Message: ${error.message}`
        );
        return res.status(NOT_FOUND_STATUS_CODE).json({ message: error.message });
    }

}

const stripeWebhook = async (req, res) => {
    let event = req.body

    if (endpointsecret) {
        const signaure = req.body.headers['stripe-signature']
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signaure,
                endpointsecret
            )
        } catch (error) {
            console.log("webhook error", error)
            return res.status(NOT_FOUND_STATUS_CODE)
        }
    }
    //handle event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'invoice.payment_succeeded':
            /*
              Insert payment succeeded into the database
              Allowed access to your service.
            */
            console.log(`payment_succeeded: ${dataObject.status}`);
            break;
        case 'invoice.payment_failed':
            /*
              If the payment fails or the customer does not have a
              valid payment method, an invoice.payment_failed event is sent,
              the subscription becomes past_due.
              Use this webhook to notify your user that their payment has
              failed and to retrieve new card details.
            */
            console.log(`invoice.payment_failed: ${dataObject.status}`);
            break;
        case 'customer.subscription.created':
            // Insert active into database and grant access to service
            console.log(`customer.subscription.created: ${dataObject.status}`);
            break;
        case 'customer.subscription.updated':
            // Insert active into database and grant access to service
            console.log(`customer.subscription.updated: ${dataObject.status}`);
            break;
        case 'customer.subscription.deleted':
            if (event.request != null) {
                /*
                  handle a subscription cancelled by request
                  from above.
                */
                console.log(`customer.subscription.deleted: ${dataObject.status}`);
            } else {
                /*
                  handle subscription cancelled automatically based
                  upon subscription settings.
                */
                console.log(`customer.subscription.deleted: ${dataObject.status}`);
            }
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    res.send();

}

module.exports = { RetriveProduct, CreateSubscription }