const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');

let app = express();

// We store the data in this variable as an Object
var orders = {};

//Parse the XML data from the body
app.use(bodyParser.json());

// Error Handling
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.sendStatus(500);
});

/**
 * implements HTTP Verb POST
 * respond is the URI(location) of the order
 * with a random integer from 0-100 as orderId
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

  /**
   * implements HTTP Verb GET on all orders
   */
app.get('/order', (req, res) =>{
    try {
        extractOrderFromRequest(req).then((order)=>{
                if (order != null) {
                    res.set("Content-Type", "application/json");
                    res.send(order);
                }
                else {
                    res.sendStatus(404);
                }
        });
    } catch (error) {
        res.sendStatus(500);
    }
  })

/**
 * implements HTTP Verb GET on specific order with orderId
 * respond is the specific order
 */
app.get('/order/:orderId', (req, res) =>{
    try {
        getOrder(req.params.orderId).then((order)=>{
            if(order != null){
                res.set("Content-Type", "application/json");
                res.send(order); // This will be an Object without XML Syntax
            }else{
                res.sendStatus(404);
            }
        }).catch((error)=>{
            console.log(util.inspect(error, false, null));
            res.sendStatus(404);
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
saved port in the constant variable settings
*/
const settings = {
    port: process.env.PORT || 3000
};


/**
 * Here we build the location header
 *
 * We use the informations from the request and the generated ID for this order
 * @param {object} req
 * @param {number} orderId
 */
function computeLocationHeader(req, orderId){

    let locationHeader = `${req.protocol}://${req.headers.host}/order/${orderId}`;

    return locationHeader
}

/**
 * This function writes the order into an object file under a random ID
 *
 * We check if the generated ID is already used for an order
 * if not, we save the order with the generated ID
 * @param {object} order
 */
function saveOrder(order) {
    let isUniqueID = false;
    let internalOrderId;
    while (!isUniqueID) {
        internalOrderId = Math.floor(Math.random() * (100 - 1)+1);
        if (orders.internalOrderId == null) {
            isUniqueID = true;
        }
    }
    orders[internalOrderId] = order;
    return internalOrderId;
}

/**
 * Extracting the order from the request body
 * @param {object} req
 */
function extractOrderFromRequest(req) {
    return new Promise((resolve, reject) => {
        resolve(req.body);
        reject("Something went wrong");
    })
}

/**
 * We get the order from the order object with the given ID
 * if the order with orderID does not exist, we reject the promise
 * @param {number} orderId
 */
function getOrder(orderId) {
    return new Promise((resolve, reject) => {
        if(orders.orderId != null){

            resolve(orders.orderId);
        }else{
            reject(`Order with ID ${orderId} not found!`);
        }
    })
}

// The port, where the app is listening
app.listen(3000);
