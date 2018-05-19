const express = require('express');

let app = express();

// Error Handling
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.end(err.status);
    next();
});

/*
implements HTTP Verb POST
respond is the URI of the order 
with a random integer from 0-9 as orderId
*/
app.post('/order', (req, res) =>{
    res.json({ uri: req.protocol + "://" + req.headers.host + "/" + "order" + "/" + Math.floor(Math.random() * 10) });
  })

/*
implements HTTP Verb GET on all orders
*/
app.get('/order', (req, res) =>{
    res.send('All Orders!');
  })

/*
implements HTTP Verb GET on specific order with orderId
respond is the specific order
*/
app.get('/order/:orderId', (req, res) =>{
      res.send('Order: ' + req.params.orderId);
    })

/* 
implements HTTP Verb PUT on specific order with orderId 
respond is the specific order
*/
app.put('/order/:orderId', (req, res) =>{
      res.send('Order updated: ' + req.params.orderId);
    })

/* 
implements HTTP Verb DELETE on specific order with orderId 
respond is the specific order
*/
app.delete('/order/:orderId', (req, res) =>{
      res.send('Order deleted: ' + req.params.orderId);
    })

/*
saved port in a constant variable
*/
const settings = {
    port: process.env.PORT || 3000
};

app.listen(3000);