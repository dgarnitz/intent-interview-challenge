const express = require('express')
const app = express()
const port = 3000
var path = require('path')
let cart = {};
let catalogue = require('./catalogue.json');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/cart.html'))
    if (Object.entries(cart).length === 0 && cart.constructor === Object) {
        resetCart();
    } 
})

app.get('/editCart', (req, res) => {
    handleRequest(req);
    res.send(getCartTotal());
})

app.get('/clearCart', (req, res) => {
    resetCart();
    res.send(getCartTotal());
})

app.get('/cartTotal', (req, res) => {
    res.send(getCartTotal());
})

app.get('/cartContents', (req,res) => {
    res.send(catalogue);
})

function handleRequest(req) {
    if (req.query.add==='true') {
        cart[req.query.id]+=1;
    } else if (req.query.add==='false' && cart[req.query.id]>0){
        cart[req.query.id]-=1;
    }
}

function getCartTotal() {
    let price = 0;
    for (id in cart){
        for (item of catalogue) {
            if (item.id === id) {
                if(item.volume_discounts.length === 0 || cart[id] < item.volume_discounts[0].number) {
                    price += (item.unit_price * cart[id])
                } else {
                    price = (item.volume_discounts[0].price) 
                            * (Math.floor(cart[id]/item.volume_discounts[0].number)) 
                            + (cart[id]%item.volume_discounts[0].number)*item.unit_price
                }
            }
        }
    }
    return String(price.toFixed(2));
}

function resetCart() {
    for (item of catalogue) {
        cart[item.id] = 0;
    }
}

let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = server;