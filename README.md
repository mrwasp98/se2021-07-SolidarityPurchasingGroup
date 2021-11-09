# se2021-07-SolidarityPurchasingGroup

## API

### Add new product request
* URL: `/api/requests`
* HTTP method: POST
* description: add a new product request of a client
* Request body: 
``` JSON
[{
    "userid": 0, 
    "creationdate": "01/01/2021", 
    "claimdate": "01/02/2021", 
    "confirmationdate": "", 
    "deliveryaddress": "Corso Duca degli Abruzzi, 21, Torino", 
    "deliveryid": 1, 
    "status":"", 
    "productid": 0, 
    "quantity": 2, 
    "price": "3,50"
}]

```
* Response: `200 OK`, `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

### Get available clients
* URL: `api/clients`
* HTTP method: GET
* Description: get from the Client table all the clients present in the system.
* Request body: None
* Response body: an array with all the clients,
``` JSON
[{
    "userid": 0, 
    "name": "John", 
    "surname": "Doe", 
    "wallet": 50.30, 
    "address": "Corso Duca degli Abruzzi, 21, Torino"
}]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

### Add client
* URL: `api/clients`
* HTTP method: POST
* description: add a new client with a wallet and an address
* Request body:
``` JSON
[{
    "name": "Grrmafa", 
    "surname": "Idcamcv", 
    "wallet": 50.30, 
    "address": "Corso Duca degli Abruzzi, 21, Torino"
}]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

### Get available products
* URL: `api/products`
* HTTP method: GET
* Description: get from the table of all products those are available with a filtering query
* Request body: None
* Response body: an array with all available products,
``` JSON
[{
    "id": 0, 
    "name": "Artichoke", 
    "farmerid": 0, 
    "price": 2, 
    "measure": "kg", 
    "category": "Vegetables", 
    "typeofproduction": "", 
    "picture": ""
}]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

### Hand out product
* URL: `api/orders/{orderid}`
* HTTP method: PUT
* Description: send to backend the requestid 
* Request parameters: orderid
* Response: `err: PUT error` (generic error)
