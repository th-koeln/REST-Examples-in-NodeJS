const express = require('express');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

let app = express();

// We store the data in this variable as an Object
var ordersXML;

//Parse the XML data from the body
app.use(bodyParser.xml());

// Error Handling
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.sendStatus(500);
});

/*
implements HTTP Verb POST
respond is the URI of the order 
with a random integer from 0-9 as orderId
*/
app.post('/order', (req, res, next) =>{

    try {
        extractOrderFromRequest(req).then((order)=>{
                if(order == null){
                    res.sendStatus(400);
                }else{
                    let internalOrderId = saveOrder(order);
                    res.set("Location", computeLocationHeader(req, internalOrderId));
                    res.sendStatus(201);
                }
            });
    } catch (error) {
        res.sendStatus(500);
    }
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
    try {
        let order = getOrder(req.params.orderId);
        getOrder(req.params.orderId).then((order)=>{
            if(order != null){
                res.set("Content-Type", "application/xml");
                res.send(order); // This will be an Object without XML Syntax
            }else{
                res.sendStatus(404);   
            }
        }) 
    } catch (error) {
        res.sendStatus(500);
        // Error Handling
    }
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

/*
Building the location header
*/
function computeLocationHeader(req, orderId){

    let locationHeader = `${req.protocol}://${req.headers.host}/order/${orderId}`;

    return locationHeader
}

/*
This function writes the order into a database under a random ID
For example purposes we overwrite the old order with the new one
We dont link the order directly with an ID, but generating a new ID every time
*/
function saveOrder(order) {

    let internalOrderId = Math.floor(Math.random() * 10);

    ordersXML = order;

    return internalOrderId;
}

/*
Extracting the order from the request body
*/
function extractOrderFromRequest(req) {
    return new Promise((resolve, reject) => {
        resolve(req.body);
        reject("");
    })
}

/*
We just return the saved order from the POST if available for example purposes
orderId doesnt matter right row
*/
function getOrder(orderId) {
    // TODO: convert Javascript Object to XML, problably with the "js2xmlparser" module
    return new Promise((resolve, reject) => {
        resolve(ordersXML);
        reject("");
    })
}


app.listen(3000);