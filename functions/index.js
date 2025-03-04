/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started


// Replace with your Firebase project config.
const firebaseConfig = {
    apiKey: "AIzaSyDVeSP_I30Io3s6wHIgbzZCGg_uuIMXr60",
    authDomain: "stripe-subscription-payment.firebaseapp.com",
    projectId: "stripe-subscription-payment",
    storageBucket: "stripe-subscription-payment.firebasestorage.app",
    messagingSenderId: "708639114056",
    appId: "1:708639114056:web:621780405cbe98e8d5e97d",
    measurementId: "G-HJNGKG0L31"
};

initializeApp(firebaseConfig);
const db = getFirestore();

exports.getCustomerSubscriptionByEmail = onRequest({ region: "us-east1" },
    async (request, response) => {
        response.set('Access-Control-Allow-Origin', "*");
        response.set("Access-Control-Allow-Headers",
            "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, " +
            "Content-Type, Access-Control-Request-Method, " +
            "Access-Control-Request-Headers");

        const email = request.query.email;
        if (!email) {
            return response.status(400).send("Email is missing");
        }
        logger.info(`Getting customer with email: ${email}`);

        const customersRef = db.collection("customers");
        const customerSnapshot = await customersRef.where("email", "==", email)
            .get();

        if (customerSnapshot.empty) {
            return response.status(404)
                .send("No customer found with that email");
        }

        const customer = customerSnapshot.docs[0];
        const subscriptionSnapshot = await db.collection("customers")
            .doc(`${customer.id}`)
            .collection('subscriptions')
            .where('status', 'in', ['trialing', 'active'])
            .get();

        // Expect to have only 1 subscription
        const subscriptions = subscriptionSnapshot.docs.map((doc) => {
            return {
                id: doc.id
            };
        });

        return response.status(200).json(subscriptions);
    }
);
