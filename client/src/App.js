import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { addPRequest, getClients } from "./API/API"
import MyNav from "./Components/MyNav";
import { LoginForm } from "./Components/LoginForm";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProductsList from "./Components/ProductsList";
import ProductRequest from "./Components/ProductRequest";
import { Container, Row, Col } from "react-bootstrap";
import Handout from "./Components/Handout";
import Register from "./Components/Register";
import {login, getUserInfo} from "./API/API.js";

function App() {
  const [dirty, setDirty] = useState(false);
  const [farmers, setFarmers] = useState(["Tizio", "Caio", "Sempronio", "Mino", "Pino"]);
  const [categories, setCategories] = useState(["Vegetables", "Meat", "Bread", "Eggs", "Milk"]);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([{
    "id": 0,
    "name": "Artichoke",
    "farmerid": 0,
    "price": 2,
    "measure": "kg",
    "category": "Vegetables",
    "typeofproduction": "",
    "picture": ""
  }, {
    "id": 1,
    "name": "lOLLO",
    "farmerid": 1,
    "price": 200,
    "measure": "kg",
    "category": "Vegetables",
    "typeofproduction": "",
    "picture": ""
  }]);
  const [clients, setClients] = useState([]);

  const [orders, setOrders] = useState([
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
        quantity: 10,
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
  ]);
  const [order, setOrder] = useState();

  useEffect(() =>{
    const checkAuth = async() => {
      try {
        const user = await getUserInfo();
        setUsername(user.name);
        setLogged(true);
      } catch(err) {
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

//   useEffect(() => {

//     let order = orders[2];

//     let listProducts = [];

//     order.products.forEach((p) => {
//       listProducts.push({
//         productid: p.id,
//         quantity: p.quantity,
//         price: p.price
//       })
//     })

//     addPRequest(order.userid,
//       order.creationdate,
//       order.claimdate,
//       order.confirmationdate,
//       order.deliveryaddress,
//       order.deliveryid,
//       order.status,
//       listProducts).then(() => {}).catch((err) => {});
// }, []); 

return (
  <>
    <Router>
      <Route path="/"> <MyNav IsLogin={false} /></Route>
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

        <Route exact path='/productRequest' render={() => <ProductRequest clients={clients} setClients={setClients} products={products} order={order} setOrder={setOrder} setDirty={setDirty}/>} />
        <Route exact path="/handout" render={() => <Handout clients={clients} setClients={setClients} orders={orders} setOrders={setOrders} />} />
        <Route exact path="/registerClient" render={() => <Register />} />
        <Route exact path="/login" render={() => <LoginForm login={login} setLogged={setLogged} setUser={setUsername}/>} />
      </Router>
    </>
  );
}

export default App;
