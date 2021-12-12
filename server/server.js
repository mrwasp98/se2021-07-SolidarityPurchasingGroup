"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator");
const clientDao = require("./client-dao");
const orderDao = require("./order-dao");
const orderlineDao = require("./orderline-dao");
const productDao = require("./product-dao");
const farmerDao = require("./farmer-dao");

const passport = require("passport"); //auth middleware
const LocalStrategy = require("passport-local").Strategy; //Username and password for login
const session = require("express-session"); //enable sessions
const userDao = require("./user-dao"); //module fo accessing the users in the DB
var path = require("path");


var multer = require('multer')


/*** Set up Passport ***/

//Inizializa and configure passport
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "incorrect username and/or password.",
        });
      return done(null, user);
    });
  })
);

//Serialize and deserialize user (user object <-> session)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//starting from the data in the session, we extract the current (logged-id) user
passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); //This will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;
// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//Custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "not authenticated" });
};

//set up the session
app.use(
  session({
    //by defoult, Passport uses a MemoryStore to keep track of the sessions
    secret:
      "a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie",
    resave: false,
    saveUninitialized: false,
  })
);

/*** Then init passport ***/
app.use(passport.initialize());
app.use(passport.session());

//FOR THE PHOTOS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next()
})

//TEST GET route
app.get("/api/test", (req, res) => {
  res.json({ textsent: "backend ok!" });
});

//ACTIVE: activate the server
module.exports = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//GET: get all clients
app.get("/api/clients", async (req, res) => {
  clientDao
    .getClients()
    .then((client) => res.json(client))
    .catch(() => res.status(500).end());
});

//GET: get client by id
app.get("/api/client/:clientid", async (req, res) => {
  clientDao
    .getClientById(req.params.clientid)
    .then((client) => {
      if (client === undefined) res.status(404).end();
      else res.status(200).json(client);
    })
    .catch(() => res.status(500).end());
});

//POST: insert new client
app.post(
  "/api/client",
  [
    check(["wallet"]).isFloat(),
    check(["username"]).isEmail(),
    check(["name"]).isString().isLength({ min: 2 }),
    check(["surname"]).isString().isLength({ min: 2 }),
    check(["address"]).isLength({ min: 3 }),
    check(["password"]).isString().isLength({ min: 6 }),
    check(["type"]).isString().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array() });
    }
    const user = {
      username: req.body.username,
      password: req.body.password,
      type: req.body.type,
    };
    const userId = await userDao.insertUser(user);

    const client = {
      userid: userId,
      name: req.body.name,
      surname: req.body.surname,
      wallet: req.body.wallet,
      address: req.body.address,
    };

    try {
      const result = await clientDao.insertClient(client);
      res.status(200).json(result);
    } catch (err) {
      res.status(503).json({
        error: `Database error during the creation of new client: ${err}.`,
      });
    }
  }
);

//GET: get orders given a clientid
app.get("/api/orders", async (req, res) => {
  orderDao
    .getOrders(req.query.clientid)
    .then((orders) => res.status(200).json(orders))
    .catch(() => res.status(500).end());
});

//PUT: update order status
app.put("/api/orders/:orderid", async (req, res) => {
  try {
    const result = await orderDao.updateOrderStatus(
      req.params.orderid,
      req.body.status
    );
    if (result == true) res.status(200).end();
    else res.status(404).end();
  } catch (err) {
    res.status(503).json({ error: `Database error ${err}.` });
  }
});

//POST: insert new product in the db
app.post('/api/product', async (req, res) => {
  productDao.insertProduct()
})


//GET: get all available products
app.get("/api/products/:date", async (req, res) => {
  productDao
    .getProductsAvailable(req.params.date)
    .then((products) => res.status(200).json(products))
    .catch(() => res.status(500).end());
});

//GET: get all farmers name (actually it gives place and userid)
app.get("/api/farmers", async (req, res) => {
  farmerDao
    .getFarmers()
    .then((farmers) => res.status(200).json(farmers))
    .catch(() => res.staus(500).end());
});

//POST: post products in the table
app.post('/api/product', async (req, res) => {
  try{
  let numberId = await productDao.insertProduct(req.body);

  res.status(200).json({
    status: 200
  })
}catch(err){
  res.status(500).json({
    status: 500,
    argoment: req.body
  })
}
})

//POST: post the request by shop employee
app.post("/api/requests", async (req, res) => {
  try {
    // Get the products availability in the magazine
    let productsAvailability = await productDao.getProductsAvailable(req.body.creationdate);

    // Verify the request (check the quantitiy)
    let products = req.body.products; // Copy the list of products

    let listProductsNotAvailability = []; // List the products not availability in the magazine
    products.map((product) => {
      let singleProduct = productsAvailability.filter(
        (p) => p.id === product.productid
      );
      if (!singleProduct.length || singleProduct[0].quantity < product.quantity) {
        listProductsNotAvailability.push(product); // Quantity requested not available
      }
    });

    if (!listProductsNotAvailability.length) {
      // All products are availability. Create new order
      let order = {
        userid: req.body.userId,
        creationdate: req.body.creationdate,
        claimdate: req.body.claimdate,
        confirmationdate: req.body.confirmationdate,
        deliveryaddress: req.body.deliveryaddress,
        status: req.body.status,
      };
      let numberId = await orderDao.insertOrder(order);

      products.forEach((product) => {
        // Create new request line
        let line = {
          orderid: numberId,
          productid: product.productid,
          quantity: product.quantity,
          price: product.price,
        };

        orderlineDao
          .insertOrderLine(line)
          .then()
          .catch((err) => {
            orderDao.deleteOrder(numberId); // Delete the order
          });

        let x = productDao
          .updateProductsQuantity(line.productid, line.quantity)
          .then()
          .catch(() => {
            res.status(406).json({
              status: 406,
              error: `A few product are not availability`,
              listofProducts: listProductsNotAvailability,
            });
          });
      });
      res.status(200).json({
        status: 200
      })
    } else
      res.status(406).json({
        status: 406,
        error: `A few product are not availability`,
        listofProducts: listProductsNotAvailability,
      });
  } catch (err) {
    res.status(503).json({ error: `Database error ${err}.` });
  }
});

/*** User APIs ***/

//LOGIN
app.post("/login", passport.authenticate("local"), (req, res) => {
  //If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});

//DELETE /logout
//logout
app.delete("/logout", (req, res) => {
  req.logout();
  res.end();
});

//GET: get informations on the current session (logged users)
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

/***  --------  ***/

//GET: get orders with products given a clientid
app.get("/api/completeOrders", async (req, res) => {
  try {
    const orders = await orderDao.getOrders(req.query.clientid);
    for (const order of orders) {
      const products = await orderlineDao.getOrderLinesWithProducts(order.id);
      order.products = products;
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).end();
  }
});

//PUT: top up the client's wallet
app.put("/api/clients/:clientid", async (req, res) => {
  try {
    const result = await clientDao.topUp(req.params.clientid, req.query.ammount);
    if (result == true) res.status(200).end();
    else res.status(404).end();
  } catch (err) {
    res.status(503).json({ error: `Database error ${err}.` });
  }
});

//POST: post a new shop employee
app.post("/api/shopemployee",
  [
    check(["username"]).isEmail(),
    check(["password"]).isString().isLength({ min: 6 }),
    check(["type"]).isString().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array() });
    }
    const user = {
      username: req.body.username,
      password: req.body.password,
      type: req.body.type
    };

    try {
      const result = await userDao.insertUser(user);
      res.json(result);
    } catch (err) {
      res.status(503).json({
        error: `Database error during the creation of new client: ${err}.`,
      });
    }
  }
);

//GET: get orders with products given a clientid
app.get("/api/usernames", async (req, res) => {
  try {
    const usernames = await userDao.getUsers();
    res.status(200).json(usernames);
  } catch (err) {
    res.status(500).end();
  }
});

//POST: insert a new farmer
app.post(
  "/api/farmer",
  [
    check(["place"]).isString().isLength({ min: 2 }),
    check(["username"]).isEmail(),
    check(["name"]).isString().isLength({ min: 2 }),
    check(["surname"]).isString().isLength({ min: 2 }),
    check(["address"]).isLength({ min: 3 }),
    check(["password"]).isString().isLength({ min: 6 }),
    check(["type"]).isString().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array() } + console.log(errors.array()));
    }
    const user = {
      username: req.body.username,
      password: req.body.password,
      type: req.body.type,
    };
    const userId = await userDao.insertUser(user);

    const client = {
      userid: userId,
      name: req.body.name,
      surname: req.body.surname,
      place: req.body.place,
      address: req.body.address,
    };

    try {
      const result = await farmerDao.insertFarmer(client);
      res.json(result);
    } catch (err) {
      res.status(503).json({
        error: `Database error during the creation of new client: ${err}.`,
      });
    }
  }
);

//POST: update password (used a post becouse of the need of a body)
app.post(
  "/api/password",
  [
    check(["id"]).isInt(),
    check(["password"]).isString().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array() } + console.log(errors.array()));
    }
    try {
      const result = await userDao.updatePassword(req.body.password, req.body.id);
      const result1 = await userDao.updateType(req.body.id);
      res.json(result1);
    } catch (err) {
      res.status(503).json({
        error: `Database error during the update of the password: ${err}.`,
      });
    }
  }
);

//GET: get orders by their status -ant
app.get("/api/orders/status/:status", async (req, res) => {
  try {
    const orders = await orderDao.getOrdersByStatus(req.params.status);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).end();
  }
});

/*** For the photo upload ***/
const fs = require('fs')

var storage = destinazione => multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/${destinazione}`)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var uploadFoto = multer({ storage: storage('img/') }).single('file');

app.post('/api/img', function (req, res) {
  uploadFoto(req, res, err => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(req.file);
  });
});


//DELETE: delete an image from the site
app.delete('/api/img/:picture', function (req, res) {
  if (!req.params.picture) {
    console.log("No file received");
    let message = "Error! in image delete.";
    return res.status(500).json('error in delete');

  } else {
    console.log('file received');
    console.log(req.params.picture);
    try {
      fs.unlinkSync('public/img/' + req.params.picture);
      console.log('successfully deleted');
      return res.status(200).send('Successfully! Image has been Deleted');
    } catch (err) {
      // handle the error
      return res.status(400).send(err);
    }

  }

});


//GET: get orders (orderlines) given a farmerid and a date -ant
app.get("/api/orders/farmers", async (req, res) => {
  /*
    Since the user can buy items from different farmers in a single order, the farmer who wants to know
    his ordered products should receive a list of orderlines from different orders (in a date range)
  */
  try {
    const orderlines = await orderlineDao.getOrderLinesByFarmerAndDateWithProductInfo(req.query.farmerid, req.query.date);
    res.status(200).json(orderlines); //manage empty list case
  } catch (err) {
    res.status(500).end();
  }
});


//PUT: change an orderline status (given orderid and productid and status in body) -ant
app.put("/api/orderlines", async (req, res) => {
  try {
    await orderlineDao.updateOrderLineStatus(req.body.orderid, req.body.productid, req.body.status);
    //check if this change in orderline should trigger a change in the order status
    await orderDao.checkForStatusUpdate(req.body.orderid, req.body.status);
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
});