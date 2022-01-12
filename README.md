# se2-2021-07-SPG Solidarity Purchasing Group

Welcome to Solidarity Purchansing Group, a project developed during the Software Engineering 2 course in Politecnico di Torino (academic year : 2021/2022).


---
## Table of content
- [The team](#The-team:)
- [Dependencies](#dependencies)
- [Testing](#testing)
- [API](#API)
- [React client application routes](#React-client-application-routes)
- [Users credentials](#Users-credentials)
- [Bot Telegram](#Bot-telegram)
---
## The team:
- Mostafa Asadollahy
- Franscesco Ciarla
- Alessandra (Rhamiel) Comparetto
- Riccardo Di Dio
- Giacomo Inghilleri
- Antonio Materazzo
- Antonio Vespa
---
## Dependencies
To develop this web app we used ReactJS (client side) and Express (server side).

The client side dependencies are:
- bootstrap, react-bootrap : for css styles and components
- dayjs : a library to manage dates
- react-calendar : a component needed to pick date and time
- react-qr-code : a component that allow the system to create a qr code

The server side dependencies are:
- bycrypt : used to hash the passwords of the users
- express-session, express-validator : used to manage user sessions (after the login)
- morgan : this module prints the route that has been called
- multer : used to upload images
- sqlite3 : needed to use the database

The database is implemented using SQlite3.

---

## Testing

Frontend testing is performed using cypress and backend testing is performed with jest.
We check the quality of our code relying on SonarCloud analysis.

---
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
    "type": "client"
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

### Get products of a farmer
* URL: `api/productsByFarmer/<farmerid>`
* HTTP method: GET
* Description: get all products of a given farmer
* Request body: None
* Response body: an array of products,
``` JSON
[
{
    "id":1,
    "name": "Apple",
    "description": "desc",
    "farmerid": 2,
    "measure": "kg",
    "category": "Fruit",
    "typeofproduction": "some type",
    "picture": ""
},
{
    "id":2,
    "name": "Strawberry",
    "description": "desc 2",
    "farmerid": 2,
    "measure": "kg",
    "category": "Fruit",
    "typeofproduction": "some type",
    "picture": ""
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Update a product
* URL: `api/product/`
* HTTP method: PUT
* Request body:
``` JSON
[{
    "id":2,
    "name": "Strawberry",
    "description": "desc 2",
    "farmerid": 2,
    "measure": "kg",
    "category": "Fruit",
    "typeofproduction": "some type",
    "picture": ""
}]
```
* Description: updates a product
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Delete a product
* URL: `api/product/<productid>`
* HTTP method: DELETE
* Request body: none
* Description: deletes a product given its id
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

### Get all farmers place and userid
* URL: `api/farmers`
* HTTP method: GET
* Description: get for every farmer in the farmer table his place and his id
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
* Description: creates an order with its orderlines and updates quantities
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

### Insert availability
* URL: `api/availability`
* HTTP method: POST
* description: insert a new product availability
* Request body:
``` JSON
[{ 
    "productid": 1,
    "dateavailability": "2021-10-11",
    "quantity": 6,
    "status": "si",
    "price": 15.00
}]
```
* Response: `200 OK`, `503 Internal Server Error` (generic error)


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

### Get orders by status
* URL: `api/orders/status/:status`
* HTTP method: GET
* Description: get all the orders which have the given status
* Request body: None
* Response body: an array with all orders with the given status (empty array if there aren't any)
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

### Get orderlines (with product info) by farmer, date and status
* URL: `api/orders/farmers?farmerid=xxx&date=yyy&status=zzz`
* HTTP method: GET
* Description: get the orderlines of the week related to a specific farmer and with a specific status (since the user can buy items from different farmers in a single order, the farmer who wants to know
    his ordered products should receive a list of orderlines from different orders)
* Request body: None
* Response body: an array of orderlines and product info
``` JSON
[
{
    "orderid":1,
    "productid":1,
    "name":"Apple",
    "quantity":3,
    "measure":"kg",
    "price":4
},
{
    "orderid":2,
    "productid":3,
    "name":"Banana",
    "quantity":1.5,
    "measure":"kg",
    "price":10
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Update orderline status
* URL: `api/orderlines/`
* HTTP method: PUT
* Request body:
``` JSON
[{
    "orderid":1,
    "productid":2,
    "status": "packaged"
}]
```
* Description: update an orderline status given the related orderid and productid. Then it checks if this orderline update should affect the orderline's order status. If so, it updates it. 
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get weekly report about unretrieved food
* URL: `api/manager/weeklyReport/<date>`
* HTTP method: GET
* Description: get a report about last week's unretrieved food 
* Request body: None
* Response body: an array of products and quantities
``` JSON
[
{
    "productid":1,
    "name": "Apple",
    "quantity": 3,
    "measure": "kg",
    "farmerName":"Neil",
    "farmerSurname":"Watts"
},
{
    "productid":2,
    "name": "Banana",
    "quantity": 1,
    "measure": "kg",
    "farmerName":"Eva",
    "farmerSurname":"Rosalene"
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get monthly report about unretrieved food
* URL: `api/manager/monthlyReport/<date>`
* HTTP method: GET
* Description: get a report about last month's unretrieved food
* Request body: None
* Response body: an array of products and quantities
``` JSON
[
{
    "productid":1,
    "name": "Apple",
    "quantity": 3,
    "measure": "kg",
    "farmerName":"Neil",
    "farmerSurname":"Watts"
},
{
    "productid":2,
    "name": "Banana",
    "quantity": 1,
    "measure": "kg",
    "farmerName":"Eva",
    "farmerSurname":"Rosalene"
}
]
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Increment a client's missed pickups counter and get its actual value
* URL: `/api/clients/missedPickups/<clientid>`
* HTTP method: PUT
* Request body:
``` JSON
{
    "quantity": 1
}
```
* Description: increments by a given quantity the counter of missed pickups related to a client and return its actual value
* Request parameters: clientid
* Response body: the actual value of missed pickups
``` JSON
{
    "missed_pickups": 1
}
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get a client's missed pickups counter
* URL: `/api/clients/missedPickups/<clientid>`
* HTTP method: GET
* Request body: none
* Description: gets the counter of missed pickups related to a client
* Request parameters: clientid
* Response body: the actual value of missed pickups
``` JSON
{
    "missed_pickups": 1
}
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get the date untill when the client is suspended
* URL: `/api/suspended/<username>`
* HTTP method: GET
* Request body: none
* Description: gets the date untill when the client is suspended
* Request parameters: username of the client
* Response body: the date untill the when the client is suspended, if it's not suspend it gets null.
``` JSON
{
    "suspended": "2022-02-13"
}
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

### Get a client's missed pickups counter
* URL: `/api/availability/<farmerid>?date=date`
* HTTP method: GET
* Request body: none
* Description: gets the available products of a given farmer
* Request parameters: farmerid (params), date(query)
* Response body: Available products and their informations
``` JSON
[
{
    "productid": 1, 
    "productName": "Artichoke", 
    "dateavailability": "2022-01-7 10:00", 
    "quantity": 6, 
    "measure": "kg", 
    "status": "pending", 
    "price": 15.00
},
{
    "productid": 2, 
    "productName": "Apple", 
    "dateavailability": "2022-01-7 10:00", 
    "quantity": 6, 
    "measure": "kg", 
    "status": "pending", 
    "price": 15.00
},
] 
```
* Response: `200 OK`, `500 Internal Server Error` (generic error)

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

### Insert a new farmer
* URL: `api/farmer`
* HTTP method: POST
* Description: creates a new user and farmer
* Request body:
``` JSON
{
    "username": "neilw",
    "password": "qwerty",
    "name": "Neil",
    "surname": "Watts",
    "place": "Cooperativa di Dr. Jekyll",
    "address": "Via Trotta, 3, Torino, TO",
    "type": "farmer"
}
```
* Response body: the farmer's id
* Response: `200 OK`, `503 Internal Server Error` (generic error),  `422 Unprocessable Entity`


---
## React client application routes
- Route `/`: this route renders the Navbar, the Homepagea and the Modal that pops up to inform the logged client that his budget is insufficient.
- Route `/products`: this route renders the page in which the shopemployee and the client can browse the producs, with their description and images.
- Route `/farmerhome`: this route renders the farmer's homepage, in which he/she can report the availability of his/her products for next week.
- Route `/editProduct`: this route renders the form that the farmer can use to edit product attributes
- Route `/addProduct`: this route renders the form that the farmer can use to add a new product
- Route `/employeehome`: this route renders the shopemployee homepage from which the employee can start any tasks he/she has to do
- Route `/clienthome`:this route renders the client homepage from which he/she can perform any task desired
- Route `/wallet/:id`: this route renders the form from which the shopemployee can top-up a client's wallet
- Route `/productRequest`: renders the page from which the shopemployee can create and order on the behalf of the client.
- Route `/manageOrders`: renders the page from which the shopemployee can check failed orders
- Route `/handout`: renders the page used by the shopemployee to confirm the handout of an order
- Route `/registerClient`: renders the page used by the shopemployee to add a new client in the system
- Route `/login`: renders the page that lets farmer, shopemployees and clients to login
- Route `/user`: renders the page giving the unregisterd user to choose the type of user he want to register as
- Route `/user/:type`: renders the registration form to register as client, farmer or shopemploye, depending on the type choosen in the previews page.
- Route `/user/client/password`: renders the page where a client previewsly inserted into the system by a shop epmloyee can change the password for hi account
---
## Database tables
- User (id, username, password, type) 
- Farmer (userid, name, surname, place, address)
- Client(userid, name, surname, wallet, address, missed_pickups, suspended)
- Product (id, name, description, farmerid, price, measure, category, typeofproduction, picture) 
- Availability (productid, dateavailability, quantity, status, price)
- Order (id, userid, creationdate, claimdate, confirmationdate, deliveryaddress, status)
- OrderLine (orderid, productid, quantity, price, status)

---
## Users credentials 

| Type | Username | Password |
|---|---|---|
| Client | client1@polito.it | qwerty123 |
| Client | client2@polito.it | qwerty123 |
| Client | client3@polito.it | qwerty123 |
| Client | client1@polito.it | qwerty123 |
| Farmer | farmer1@polito.it | qwerty123 |
| Farmer | farmer2@polito.it | qwerty123 |
|  Shop Employee |  shopemployee@polito.it |  qwerty123 |
| Manager | manager@polito.it | qwerty123 |
| Warehouse manager | warehouse@polito.it | qwerty123 |

----

## Bot Telegram 
It's possible to get updates via telegram (you need to be a registered user) when the list of available products for the next week is posted by a farmer. In order to do so, you have to:
* open the following link:  https://t.me/SPGP07bot
* type "/start"
* wait for updates



