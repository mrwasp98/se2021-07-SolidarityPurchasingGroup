import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { addPRequest, getClients, getAvailableProducts, getFarmers } from "./API/API"
import MyNav from "./Components/MyNav";
import { LoginForm } from "./Components/LoginForm";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProductsList from "./Components/ProductsList";
import ProductRequest from "./Components/ProductRequest";
import ModalEnd from "./Components/ProductRequest";
import { Container, Row } from "react-bootstrap";
import Handout from "./Components/Handout";
import Register from "./Components/Register";
import { login, getUserInfo, logout } from "./API/API.js";
import HomeButtons from "./Components/HomeButtons";

function App() {
  const [dirty, setDirty] = useState(false);
  const [farmers, setFarmers] = useState([]);
  const [categories, setCategories] = useState(["Vegetables", "Meat", "Bread", "Eggs", "Milk"]);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [resultOrder, setResultOrder] = useState()
  const [clientOrders, setClientOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [show, setShow] = useState(false);
  const [dirtyAvailability, setDirtyAvailability] = useState(true);


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

  useEffect(() => {
    getFarmers().then((p) => {
      //setTimeout(() => {
      setFarmers(p);
      //}, 1000);
    });
  }, []);

  useEffect(() => {
    getClients()
      .then((res) => setClients(res))
  }, []);

  useEffect(() => {
    if (dirtyAvailability) {
      getAvailableProducts()
        .then((res) => setProducts(res));
        setDirtyAvailability(false)
    }
  }, [dirtyAvailability]);



  const [messageProductRequest, setMessageProductRequest] = useState({
    type: "",
    show: false,
    text: ""
  })

  useEffect(async () => {
    if (dirty) {

      addPRequest(order.userid,
        order.creationdate,
        order.claimdate,
        order.confirmationdate,
        order.deliveryaddress,
        order.deliveryid,
        order.status,
        order.products).then(result => {
          // A few products are not availability
          //console.log(res.listofProducts);  The list of products non availability "res.listofProducts"
          if (result.status !== undefined && result.status === 406)
            setMessageProductRequest({
              type: "error",
              show: true,
              text: result.listofProducts.map(x => x.name + " ").concat("are not available")
            })
          else if (result.status !== undefined && result.status === 200)
            setMessageProductRequest({
              type: "done",
              show: true,
              text: "Order received!" //this message won't be used. I don't remove it for consistency
            })
        }).catch(err => { })
        setDirty(false);
    }

  }, [dirty]);


  /*
    useEffect(() => {
      if (dirty) {
        setDirty(false)
  
        
      } */




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
  // }, [dirty]);

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
        <Route exact path='/' render= {() =><HomeButtons/> } />
        <Route exact path='/productRequest' render={() => <ProductRequest farmers={farmers} clients={clients} products={products} order={order} setOrder={setOrder} setDirty={() => setDirty(true)} message={messageProductRequest} setMessage={setMessageProductRequest} setDirtyAvailability={setDirtyAvailability}/>} />
        <Route exact path="/handout" render={() => <Handout clients={clients} setClients={setClients} orders={clientOrders} setOrders={setClientOrders} />} />
        <Route exact path="/registerClient" render={() => <Register />} />
        <Route exact path="/login" render={() => <LoginForm login={login} setLogged={setLogged} setUser={setUsername} />} />
      </Router>
    </>
  );
}

export default App;
