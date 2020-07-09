// Import stripe library (npm i stripe)
// Es necesario pegar la clave secreta que genera stripe a partir de la clave publica
// Esta clave se encuentra en nuestro dashboard de stripe 

const stripe = require('stripe')('sk_test_51GuukdBytFFQ2wtX3xXnhWdWkbmQtZKSytcpZ49w9gN3QRFjrPynKTndDY6Wp9WwGdRSSP5G6qfgfIl9tieHyWbT00bfZLZzPH');

// Defining router

const express = require('express');
const router = express.Router();


router.get ('/', (req,res) => {
    res.render('index');
});

router.post('/checkout',async (req,res) =>{
    console.log(req.body);
    // Almacenando el comprador
    const customer = await stripe.customers.create({
        email : req.body.stripeEmail,
        source : req.body.stripeToken
    });
    // Almacenando la orden de compra
    const charge = stripe.charges.create({
        amount : '3000',
        currency: 'eur',
        customer: customer.id,
        description: 'Meetup Product'
    })
    console.log(charge.id);
    // Final show success view
    res.render('downloads');
})


module.exports = router;