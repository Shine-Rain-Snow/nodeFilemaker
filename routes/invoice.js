var express = require('express');
var data = require('../app/data');
var router = express.Router();
const request = require('request-promise');

var stripe = require('stripe')(data.STRIPE_SECRET);

// router.get('/:id', function (req, res, next) {
//     downloadfile("", res);
// })

router.get('/:id', function (req, res, next) {
    var id = req.params.id;

    //to get access token
    callAPI(data.API_SESSION, data.METHODE_POST, {}, function (responce1) {

        console.log("Logedin successfully.")
        //to get bank details
        callAPI(data.API_GET_BANK_DETAILS, data.METHODE_GET, {}, function (resonse2) {
            var bankDetails = {
                bankName: resonse2.data[0].fieldData.Bank_Name,
                bsb: resonse2.data[0].fieldData.BSB,
                accountNumber: resonse2.data[0].fieldData.Account_Number,
                accountName: resonse2.data[0].fieldData.Account_Name
            };

            console.log("Fetched bank transfer details successfully.")
            //to get invoice details
            callAPI(data.API_GET_SINGLE_INVOICE, data.METHODE_POST, {
                "query": [
                    {"id": "==" + id}]
            }, function (resonse) {
                console.log("Invoice found successfully.")
                console.log(resonse.data[0].fieldData.QBO_InvoicePDF);
                downloadfile(resonse.data[0].fieldData.QBO_InvoicePDF, res);
                // logoutSession();
                // res.render('invoice', {
                //     customerName: resonse.data[0].fieldData['Invoice_Customer::contactGivenName'],
                //     stripeFees: resonse.data[0].fieldData["StripeFees Amount"],
                //     totalAmount: (resonse.data[0].fieldData.totalAmtSummary + resonse.data[0].fieldData["StripeFees Amount"]) * 100,
                //     json: resonse.data[0].fieldData.QBO_InvoicePDF,
                //     title: 'Invoice and strip payment option.',
                //     timestamp: new Date().getTime(),
                //     customerId: resonse.data[0].fieldData.id_Customer,
                //     invoiceId: resonse.data[0].fieldData.id,
                //     invoiceDocNumber: resonse.data[0].fieldData.docNumber,
                //     businessName: data.BUSINESS_NAME,
                //     stripeKey: data.STRIPE_KEY,
                //     currency: data.CURRENCY,
                //     pdfUrl: resonse.data[0].fieldData.QBO_InvoicePDF,
                //
                //     //bank details
                //     invoiceDocNumber: resonse.data[0].fieldData.docNumber,
                //     bankName: bankDetails.bankName,
                //     bsb: bankDetails.bsb,
                //     accountNumber: bankDetails.accountNumber,
                //     accountName: bankDetails.accountName
                // });
            }, function (err) {
                logoutSession();
                res.render("error", {error: err})
            });

        }, function (err) {
            res.render("error", {error: err})
        });

    }, function (err) {
        res.render("error", {error: err})
    })
});

router.post('/charge', (req, res) => {
    var reqParams = req.body;
    var token = reqParams.stripeToken;
    var chargeAmount = parseInt(reqParams.chargeAmount);
    var charge = stripe.charges.create({
        amount: chargeAmount,
        currency: data.CURRENCY,
        source: token
    }, function (err, charge) {
        if (err && err.type == 'StripeCardError') {
            console.log('Payment faild getting error');
            console.log(err);
        } else {
            if (err != null) {
                console.log('payment error');
                console.log(err);
            } else {
                console.log('payment success');
            }

            new Promise(function (resolve, reject) {

                var token = callAPI(data.API_SESSION, data.METHODE_POST, {}, function (res) {
                    resolve(res);
                }, function (err) {
                    reject(err);
                });

            }).then(function (results) {
                var paymentResponse = {};
                var scriptParam = reqParams.invoiceId +
                    "|" + reqParams.customerId +
                    "|" + reqParams.stripeFees +
                    "|" + (charge.amount / 100) +
                    "|" + (charge.amount / 100) +
                    "|" + charge.id +
                    "|" + charge.receipt_url +
                    "|" + charge.payment_method_details.type +
                    "|" + charge.payment_method_details.card.brand
                ;

                //create payment log on filemaker
                console.log(paymentResponse);
                callAPI(data.API_POST_PAYMENT_RESPONCE + encodeURI(scriptParam), data.METHODE_GET, paymentResponse, function (responce) {
                    console.log("Payment record stored to FM database successfully.");
                    logoutSession();
                    res.render("payment_success", {message: "Paid successfully", recieptUrl: charge.receipt_url})
                }, function (err) {
                    console.log("Unable to store payment record to FM database.");
                    console.log(err);
                    logoutSession();
                    res.render("error", {error: JSON.stringify(err)})
                });

            })
                .catch(function (err) {
                    console.log(err);
                });

        }
    })
})

router.get('/paySuccess', (req, res) => {
    res.render('index', {})
})

//Call service
function callAPI(url, method, params, result, error) {
    var options = {
        uri: url,
        method: method,
        body: params,

        headers: {
            'content-type': 'application/json',
            authorization: data.API_SESSION.includes(url) ? data.BASIC_AUTH : "Bearer " + data.TOKEN
        },
        json: true // Automatically parses the JSON string in the response
    };

    request(options)
        .then(function (response) {
            // console.log(response);
            data.TOKEN = data.API_SESSION.includes(url) ? response.response.token : data.TOKEN

            result(response.response);
        })
        .catch(function (err) {
            console.log(err.message);
            // API call failed...
            error(err.message);
        });
}

//logout
function logoutSession() {
    console.log("FM Token : " + data.TOKEN);
    callAPI(data.API_SESSION + "/" + data.TOKEN, data.METHODE_DELETE, {}, function (responce) {
        console.log("FM Session logout successfully.");
    }, function (err) {
        console.log("Unable to logout the FM session.");
        console.log(JSON.stringify(err));
    });
}

function downloadfile(file_url, resReturn) {

    var http = require('https');
    var url = require('url');

    var fs = require('fs');
    var url = require('url');
    var http = require('http');
    var exec = require('child_process').exec;

// App variables
//     file_url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    var DOWNLOAD_DIR = './downloads/';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
    var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
    var child = exec(mkdir, function (err, stdout, stderr) {
        if (err) throw err;
        else download_file_httpget(file_url);
    });

// Function for downloading file using HTTP.get
    var download_file_httpget = function (file_url) {
        var cookie = 'X-FMS-Session-Key=' + data.TOKEN;

        var options = {
            host: url.parse(file_url).host,
            port: 80,
            path: url.parse(file_url).pathname,
            headers: {
                'set-cookie': [cookie],
                'content-type': 'application/pdf'
            }
        };

        var file_name = url.parse(file_url).pathname.split('/').pop();
        var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

        http.get(options, function (res) {
            res.on('data', function (data) {
                console.log(data);
                console.log(data.toString());
                file.write(data);
            }).on('end', function () {
                // file.pipe(resReturn);
                file.end();
                console.log(file.path);

                //************** download ********************

                var fileReturn = fs.createReadStream(file.path);
                var stat = fs.statSync(file.path);
                resReturn.setHeader('Content-Length', stat.size);
                resReturn.setHeader('Content-Type', 'application/pdf');
                resReturn.setHeader('Content-Disposition', 'attachment; filename='+file_name);
                fileReturn.pipe(resReturn);

                //**********************************

                console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
            });
        });
    };

}


module.exports = router;
