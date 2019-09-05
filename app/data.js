//FM details
var domain = 'https://dev.baseintegration.com.au';
var path = '/fmi/data/v1/databases/';
var database = 'Evergreen_Blades_Dev';

const Constant = {
    //FM data API's
    API_SESSION: domain + path + database + '/sessions',
    API_GET_INVOICE: domain + path + database + '/layouts/Invoice/records/',
    API_GET_SINGLE_INVOICE: domain + path + database + '/layouts/GetInvoiceRequest/_find',
    API_CREATE_PAYMENT_LOG: domain + path + database + '/layouts/AddPayment/records',
    API_POST_PAYMENT_RESPONCE: domain + path + database + '/layouts/PaymentLog/script/ProcessStripePayment?script.param=',
    API_GET_BANK_DETAILS: domain + path + database + '/layouts/BankDetails/records ',

    //business details
    BUSINESS_NAME: 'Evergreen Blades',
    // BASIC_AUTH: "Basic RnJlZWxhbmNlcjpmdWtxZWMteHlQa2UwLXppamh6Mg==", //Freelancer
    BASIC_AUTH: "Basic Q2xpZW50V2ViQWNjZXNzOmZ1a3FlYy14eVBrZTAtemlqaHoy", //ClientWebAccess
    TOKEN: "",
    METHODE_POST: 'POST',
    METHODE_GET: 'GET',
    METHODE_DELETE: 'DELETE',

    //stripe details
    CURRENCY: 'AUD',
    //pankaj
    STRIPE_KEY: 'pk_test_4d1pmKkuowUHb9qCssMj5plo00llVSJyf0',
    STRIPE_SECRET: 'sk_test_v6niD3qUZJJQH0RtKgljQ0Ho00vuZAyl17',
    // paul
    // STRIPE_KEY: 'pk_test_YOwL3JYeOM4rKc7dRY7SSRbm',
    // STRIPE_SECRET: 'sk_test_cE9LXG0BJ7FcjVlksLQXolgU'
};
module.exports = Constant;