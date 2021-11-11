'use strict';

const express = require('express');
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require('express-validator');
const clientDao = require('./client-dao');
const orderDao = require('./order-dao');
const productDao = require('./product-dao');
const farmerDao = require('./farmer-dao');

const passport = require('passport'); //auth middleware
const LocalStrategy = require('passport-local').Strategy; //Username and password for login
const session = require('express-session'); //enable sessions
const userDao = require('./user-dao'); //module fo accessing the users in the DB

/*** Set up Passport ***/

//Inizializa and configure passport
passport.use(new LocalStrategy(
  function (username, password, done) {
      userDao.getUser(username,password).then((user) =>{
          if(!user)
            return done(null, false, {message: 'incorrect username and/or password.'});
          return done(null, user);
      });
  }
));

//Serialize and deserialize user (user object <-> session)

passport.serializeUser((user, done) => {
  done(null, user.id);
}),

//starting from the data in the session, we extract the current (logged-id) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id).then( user => {
    done(null, user); //This will be available in req.user
  }).catch(err => {
    done(err, null);
  });
});

// init express
const app = new express();
const port = 3001;
// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());

//Custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated())
      return next();

    return res.status(401).json({error: 'not authenticated' });
}

//set up the session
app.use(session({
  //by defoult, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false,
}));

//Then init passport
app.use(passport.initialize());
app.use(passport.session());

/*TEST GET route */
app.get('/api/test', (req, res) => {
  res.json({ textsent: "backend ok!" })
})

// activate the server
module.exports = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//get all clients
app.get('/api/clients',
  async (req, res) => {
    clientDao.getClients()
      .then(client => res.json(client))
      .catch(() => res.status(500).end());
  });

//insert new client 
app.post('/api/client', 
[
  check(['wallet']).isFloat(),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() }+ console.log(errors.array()));
  }
  const userId = await clientDao.getNewUserId();
  
  const client ={
    userid: userId,
    name: req.body.name,
    surname: req.body.surname,
    wallet: req.body.wallet,
    address: req.body.address
  };

  try {
    const result = await clientDao.insertClient(client);
    res.json(result);
  }
  catch (err) {
    res.status(503).json({ error: `Database error during the creation of new client: ${err}.` });
  }
})

//get orders given a clientid
app.get('/api/orders',
  async (req, res) => {
    orderDao.getOrders(req.query.clientid)
      .then(order => res.json(order))
      .catch(() => res.status(500).end());
  });

//update order status
//TODO manage order not existing
app.put('/api/orders/:orderid', async (req, res) => {
  try {
    await orderDao.updateOrderStatus(req.params.orderid,req.body.status);
    res.status(200).end();
  } catch (err) {
    res.status(503).json({ error: `Database error ${err}.` });
  }
});

//Get all available products
app.get('/api/products',
  async (req, res) => {
    productDao.getProductsAvailable()
      .then(products => res.json(products))
      .catch(()=> res.staus(500).end());
});

//Get all farmers name
app.get('/api/farmers',
  async (req, res) => {
    farmerDao.getFarmers()
      .then(farmers => res.json(farmers))
      .catch(()=> res.staus(500).end());
});

/*** User APIs ***/

//Login
app.post('/login', passport.authenticate('local'), (req, res) => {
  //If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});

//DELETE /logout
//logout
app.delete('/logout', (req,res) => {
req.logout();
res.end();
});

app.get('/api/sessions/current', (req, res) => {
if(req.isAuthenticated()) {
  res.status(200).json(req.user);}
else
  res.status(401).json({error: 'Unauthenticated user!'});;
});