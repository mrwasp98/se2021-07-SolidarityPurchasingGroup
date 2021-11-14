import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { addPRequest, getClients, getAvailableProducts } from "./API/API"
import MyNav from "./Components/MyNav";
import { LoginForm } from "./Components/LoginForm";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProductsList from "./Components/ProductsList";
import ProductRequest from "./Components/ProductRequest";
import { Container, Row } from "react-bootstrap";
import Handout from "./Components/Handout";
import Register from "./Components/Register";
import { login, getUserInfo, logout } from "./API/API.js";

function App() {
  const [dirty, setDirty] = useState(false);
  const [farmers, setFarmers] = useState(["Tizio", "Caio", "Sempronio", "Mino", "Pino"]);
  const [categories, setCategories] = useState(["Vegetables", "Meat", "Bread", "Eggs", "Milk"]);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);

  /* const [clientOrders, setClientOrders] = useState([
    {
      id: 1,
      userid: 4,
      creationdate: "2021-11-09",
      claimdate: "2021-11-10 12:30",
      confirmationdate: "2021-11-09",
      deliveryaddress: null,
      deliveryid: null,
      status: "confirmed",
      products: [{
        id: 1,
        name: "Carote",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }, {
        id: 2,
        name: "Patate",
        quantity: 2,
        measure: "kg",
        price: 20.11
      }]
    }, {
      id: 2,
      userid: 5,
      creationdate: "2021-11-09",
      claimdate: "2021-11-10 12:30",
      confirmationdate: "2021-11-09",
      deliveryaddress: null,
      deliveryid: null,
      status: "confirmed",
      products: [{
        id: 4,
        name: "Tomino di Capra",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }]
    }, {
      id: 3,
      userid: 6,
      creationdate: "2021-11-09",
      claimdate: "2021-11-10 12:30",
      confirmationdate: "2021-11-09",
      deliveryaddress: null,
      deliveryid: null,
      status: "confirmed",
      products: [{
        id: 4,
        name: "Tomino di Capra",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }, {
        id: 2,
        name: "Patate",
        quantity: 10,
        measure: "kg",
        price: 20.11
      }, {
        id: 1,
        name: "Patate",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }]
    }, {
      id: 4,
      userid: 7,
      creationdate: "2021-11-09",
      claimdate: "2021-11-10 12:30",
      confirmationdate: "2021-11-09",
      deliveryaddress: null,
      deliveryid: null,
      status: "confirmed",
      products: [{
        id: 7,
        name: "Salame",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }, {
        id: 6,
        name: "Croccante di nocciola",
        quantity: 10,
        measure: "unità",
        price: 20.11
      }, {
        id: 2,
        name: "Patate",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }]
    }, {
      id: 5,
      userid: 9,
      creationdate: "2021-11-09",
      claimdate: "2021-11-10 12:30",
      confirmationdate: "2021-11-09",
      deliveryaddress: null,
      deliveryid: null,
      status: "confirmed",
      products: [{
        id: 7,
        name: "Salame",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }, {
        id: 6,
        name: "Croccante di nocciola",
        quantity: 10,
        measure: "unità",
        price: 20.11
      }, {
        id: 2,
        name: "Patate",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }, {
        id: 1,
        name: "Carote",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }, {
        id: 8,
        name: "Hamburger",
        quantity: 1,
        measure: "kg",
        price: 15.11
      }, {
        id: 3,
        name: "Prezzemolo",
        quantity: 2,
        measure: "mazzi",
        price: 3.00
      }]
    }, {
      id: 6,
      userid: 4,
      creationdate: "2021-11-09",
      claimdate: "2021-11-10 12:30",
      confirmationdate: "2021-11-09",
      deliveryaddress: null,
      deliveryid: null,
      status: "confirmed",
      products: [{
        id: 4,
        name: "Tomino di capra",
        quantity: 3,
        measure: "kg",
        price: 12.10
      }]
    }
  ]) */

  const [clientOrders, setClientOrders] = useState([]);
  const [order, setOrder] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUserInfo();
        setUsername(user.name);
        setLogged(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  /*useEffect(() => {
    if (dirty) {
      API.getAvailableProducts().then((p) => {
        //setTimeout(() => {
        setProducts(p);
        setDirty(false);
        //}, 1000);
      });
    }
  }, [dirty]);*/

  useEffect(() => {
    getClients()
      .then((res) => setClients(res))
  }, []);

  useEffect(() => {
    getAvailableProducts()
      .then((res) => setProducts(res));
  }, []);


  useEffect(() => {
    if(!dirty){
      getAvailableProducts()
      .then((res) => setProducts(res));
    }
  }, [dirty]);


  useEffect(() => {
    if (!dirty)
      getAvailableProducts()
        .then((res) => setProducts(res));
  }, [dirty]);

  useEffect(() => {
    if (dirty) {
      setDirty(false)

      addPRequest(order.userid,
        order.creationdate,
        order.claimdate,
        order.confirmationdate,
        order.deliveryaddress,
        order.deliveryid,
        order.status,
        order.products).then((res) => {
          if (res.status !== undefined && res.status === 406)
            // A few products are not availability
            //console.log(res.listofProducts);  The list of products non availability "res.listofProducts"
            setErrorMessage(res.listofProducts.map(x => x.name + " not available" + "\n"));
            setShow(true);
            setOrder({});
        }).catch((err) => {
          if(err.message.includes("406")){
            setErrorMessage("Some products are not available")
            setShow(true);
          }
        });
    }



    /*let order = orders[0];

    let listProducts = [];

    order.products.forEach((p) => {
      listProducts.push({
        productid: p.id,
        quantity: p.quantity,
        price: p.price
      })
    })

    addPRequest(order.userid,
      order.creationdate,
      order.claimdate,
      order.confirmationdate,
      order.deliveryaddress,
      order.deliveryid,
      order.status,
      listProducts).then(() => {}).catch((err) => {}); */
  }, [dirty, order]);

  return (
    <>
      <Router>
        <Route path="/"> <MyNav IsLogin={logged} logout={logout} setLogged={setLogged} /></Route>
        <Route exact path='/products'>
          <Container className="p-0 m-0" fluid>
            <Row className="">
              <ProductsList
                products={products}
                categories={categories}
                farmers={farmers}
                className=""
              />
            </Row>
          </Container>
        </Route>

        <Route exact path='/productRequest' render={() => <ProductRequest clients={clients} products={products} order={order} setOrder={setOrder} setDirty={setDirty} errorMessage={errorMessage} setErrorMessage={setErrorMessage} show={show} setShow={setShow} />} />
        <Route exact path="/handout" render={() => <Handout clients={clients} setClients={setClients} orders={clientOrders} setOrders={setClientOrders} />} />
        <Route exact path="/registerClient" render={() => <Register />} />
        <Route exact path="/login" render={() => <LoginForm login={login} setLogged={setLogged} setUser={setUsername} />} />
      </Router>
    </>
  );
}

export default App;
