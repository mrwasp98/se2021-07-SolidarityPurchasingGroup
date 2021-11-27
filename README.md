# se2021-07-SolidarityPurchasingGroup

## API

### Get available clients
* URL: `api/clients`
* HTTP method: GET
* Description: get from the Client table all the clients present in the system.
* Request body: None
* Response body: an array with all the clients,
``` JSON
[
{
    "userid": 0, 
    "name": "John", 
    "surname": "Doe", 
    "wallet": 50.30, 
    "address": "Corso Duca degli Abruzzi, 21, Torino"
},
{
    "userid": 1, 
    "name": "Neil", 
    "surname": "Watts", 
    "wallet": 24.12, 
    "address": "Corso Como, 2, Milano"
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get client given his id
* URL: `api/client/<id>`
* HTTP method: GET
* Description: get client given his id
* Request body: None
* Response body: a client
``` JSON
{
    "userid": 0, 
    "name": "John", 
    "surname": "Doe", 
    "wallet": 50.30, 
    "address": "Corso Duca degli Abruzzi, 21, Torino"
}
```
* Response: `200 OK`, `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

### Add client
* URL: `api/client`
* HTTP method: POST
* description: add a new client and user
* Request body:
``` JSON
{
    "name": "Grrmafa", 
    "surname": "Idcamcv", 
    "username": "prova@prova.com",
    "wallet": 50.30, 
    "address": "Corso Duca degli Abruzzi, 21, Torino",
    "password": "123",
    "type": "farmer"
}
```
* Response: `200 OK`, `503 Internal Server Error` (generic error),  `422 Unprocessable Entity` (wrong parameters)

### Get client orders
* URL: `api/orders?clientid=<id>`
* HTTP method: GET
* Description: get client orders given his id
* Request body: None
* Response body: a list of orders
``` JSON
[
{
    "id":2,
    "userid":5,
    "creationdate":"2021-11-12",
    "claimdate":"2021-11-10 12:30",
    "confirmationdate":"2021-11-09",
    "deliveryaddress":"null",
    "status":"completed"
},
{
    "id":3,
    "userid":5,
    "creationdate":"2021-11-12",
    "claimdate":"2021-11-10 12:30",
    "confirmationdate":"2021-11-09",
    "deliveryaddress":"null",
    "status":"completed"
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get client orders with products
* URL: `api/completeOrders?clientid=<id>`
* HTTP method: GET
* Description: get client orders with products given his id
* Request body: None
* Response body: a list of orders with products
``` JSON
[
{
      "id":1,
      "userid": 4,
      "creationdate": "2021-11-09",
      "claimdate": "2021-11-10 12:30",
      "confirmationdate": "2021-11-09",
      "deliveryaddress": "null",
      "deliveryid": "null",
      "status": "confirmed",
      "products":[
                    {
                        "productid": 1,
                        "productname": "Onion",
                        "quantity": 3,
                        "measure": "kg",
                        "price": 12.10
                    }, 
                    {
                        "productid": 2,
                        "productname": "Apple",
                        "quantity": 3,
                        "measure": "kg",
                        "price": 12.10
                    }
               ]
},
{
      "id":2,
      "userid": 4,
      "creationdate": "2021-11-09",
      "claimdate": "2021-11-10 12:30",
      "confirmationdate": "2021-11-09",
      "deliveryaddress": "null",
      "deliveryid": "null",
      "status": "confirmed",
      "products":[
                    {
                        "productid": 1,
                        "productname": "Onion",
                        "quantity": 3,
                        "measure": "kg",
                        "price": 12.10
                    }, 
                    {
                        "productid": 2,
                        "productname": "Apple",
                        "quantity": 3,
                        "measure": "kg",
                        "price": 12.10
                    }
               ]
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get available products
* URL: `api/products/<date>`
* HTTP method: GET
* Description: get from the table of all products which are available with a filtering query
* Request body: None
* Response body: an array with all available products given a date,
``` JSON
[
{
    "id":46,
    "name":"Garlic",
    "description":"A description.",
    "farmerid":2,
    "price":12,
    "measure":"kg",
    "category":"Fruit and Vegetables",
    "typeofproduction":"Biological agriculture",
    "picture":"/img/garlic.png",
    "dateavailability":"2021-11-21",
    "quantity":12
},
{
    "id":47,
    "name":"Onion",
    "description":"A description.",
    "farmerid":2,
    "price":12,
    "measure":"kg",
    "category":"Fruit and Vegetables",
    "typeofproduction":"Biological agriculture",
    "picture":"/img/onion.png",
    "dateavailability":"2021-11-23",
    "quantity":12
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Update order status
* URL: `api/orders/{orderid}`
* HTTP method: PUT
* Request body:
``` JSON
[{
    "status": "completed"
}]
```
* Description: update an order status given the order's id 
* Request parameters: orderid
* Response: `200 OK`, `503 Service Unavailable` (generic error), `404 Not Found` (not present or unavailable)

### Get all farmers' names (ACTUALLY it gives place and userid!!!)
* URL: `api/farmers`
* HTTP method: GET
* Description: ---
* Request body: None
* Response body:
``` JSON
[
{
"place":"Cooperativa di Dr. Jekyll",
"userid":1
},
{
"place":"Azienda Agricola di Mr. Hyde",
"userid":2
}
]
```
* Response: `500 Internal Server Error` (generic error), //TODO add 200 OK ?

### Post the request to create an order by shop employee //TODO check if it corresponds with the actual implementation
* URL: `api/requests`
* HTTP method: POST
* description: creates an order with its orderlines and updates quantities
* Request body:
``` JSON
{
    "userid":5,
    "creationdate":"2021-11-12",
    "claimdate":"2021-11-10 12:30",
    "confirmationdate":"2021-11-09",
    "deliveryaddress":"null",
    "deliveryid": "null",
    "status":"pending",
    "products":
        [
            {
            "productid": 1, 
            "name": "Apple", 
            "quantity": 2, 
            "measure": "kg", 
            "price": 12, 
            "total": "product.price * product.quantity"
            },
            {
            "productid": 2, 
            "name": "Orange", 
            "quantity": 1, 
            "measure": "kg", 
            "price": 12, 
            "total": "product.price * product.quantity"
            }
        ]
}
```
* Response: `200 OK`, `503 Internal Server Error` (generic error),  `406 Unprocessable Entity` (some products not available)

### Top up wallet
* URL: `api/clients/{clientid}/?ammount={ammount}`
* HTTP method: PUT
* Request body:
``` JSON
[{
    "status": "completed"
}]
```
* Description: Top up the wallet of the given client adding the given ammount 
* Request parameters: clientid, ammount
* Response: `200 OK`, `503 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)

### Add user
* URL: `api/user`
* HTTP method: POST
* description: add a new user to the system
* Request body:
``` JSON
[{ 
    "username": "farmer1", 
    "password": "$2a$12$vOxMHcRpzCj9vLDUahqcsOJ9g.kqzCmUrc2DXy4Fxtk99kfuNQXqO", 
    "type": "farmer"
}]
```
* Response: `200 OK`, `503 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable) (ACTUALLY it gives 422)

## USER API

- POST `/api/login`
  - Request body: a credential object conatining username e password.
  ```JSON
    [{
      "username": "farmer1",
      "password": "farmer1"
    }]
  ```
  - Response body: the user object in the database.
  ```JSON
    [{
      "id": 1,
      "username": "farmer1",
      "type": "farmer"
    }]
  ```
  * Response: `200 OK`, `401 Unothorized` (wrong username or password)
- DELETE `/logout`
  - Request body: empty.
  - Response body: empty.
  * Response: `200 OK`
- GET `/api/sessions/current`
  - Request paameters: empty.
  - Response body: the user object saved in the sessions current.
  ```JSON
    [{
      "id": 1,
      "username": "farmer1",
      "name": "farmer"
    }]
  ```
  * Response: `200 OK`, `401 Unothorized` (wrong username or password)
