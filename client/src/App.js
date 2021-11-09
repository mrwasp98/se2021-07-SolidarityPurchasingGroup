import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import API from './API/API.js';
import MyNav from "./Components/MyNav";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProductsList from "./Components/ProductsList";
import { Container, Row, Col } from "react-bootstrap";
import Handout from "./Components/Handout";

function App() {
  const [dirty, setDirty] = useState(true);
  const [farmers, setFarmers] = useState(["Tizio", "Caio", "Sempronio", "Mino", "Pino"]);
  const [categories, setCategories] = useState(["Vegetables", "Meat", "Bread", "Eggs", "Milk"]);
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

  const [clients, setClients] = useState([
    {
      "userid": 0,
      "name": "John",
      "surname": "Doe",
      "wallet": 50.30,
      "address": "Corso Duca degli Abruzzi, 21, Torino"
    }, {
      "userid": 1,
      "name": "Giuseppe",
      "surname": "Parodi",
      "wallet": 20.21,
      "address": "Via dei Pini, 12, Pavia"
    }, {
      "userid": 2,
      "name": "Lorenzo",
      "surname": "Rossi",
      "wallet": 7.64,
      "address": "Via Lagrange, 3, Torino"
    }
  ]);

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

  return (
    <>
      <Router>
        <Route path="/"> <MyNav IsLogin={false} /></Route>
        <Route exact path='/products'>
          <Container className="p-0 m-0" fluid>
            <Row className="mt-3">
              <ProductsList
                products={products}
                categories={categories}
                farmers={farmers}
                className=""
              />
            </Row>
          </Container>
        </Route>

        <Route exact path="/handout" render={() => <Handout clients={clients} setClients={setClients}/>} />
      </Router>
    </>
  );
}

export default App;
