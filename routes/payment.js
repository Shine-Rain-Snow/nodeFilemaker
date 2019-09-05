var express = require('express');
var router = express.Router();

/* GET home page. */

router.post('/charge', (req, res) => {
    var token = req.body.stripeToken;
    var chargeAmount = req.body.chargeAmount;
    var charge = stripe.charges.create({
        amount:chargeAmount,
        currency:'gbp',
        source:token
    }, function (err,charge) {
        if(err && err.type == 'StripeCardError'){
            console.log('error a rhi h');
        }else {
            console.log(charge);
            res.redirect('/users')
        }
    })
})
router.get('/paySuccess', (req, res) => {
    res.render('index',{

    })
})
module.exports = router;
