import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyNav from "./Components/MyNav";
import { LoginForm } from "./Components/LoginForm";
import { BrowserRouter as Router, Route, } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProductsList from "./Components/ProductsList";
import ProductRequest from "./Components/ProductRequest";
import Handout from "./Components/Handout";
import Register from "./Components/Register";
import Type from "./Components/Type";
import UpdatePassword from "./Components/UpdatePassword";
import RegisterUser from "./Components/RegisterUser";
import { login, getUserInfo, logout, addPRequest, getClientById } from "./API/API.js";
import ShopEmployeeHome from "./Components/ShopEmployeeHome";
import Home from "./Components/Home.js"
import ClientHome from "./Components/ClientHome";
import Wallet from "./Components/Wallet";
import MyModal from "./Components/MyModal";

function App() {
  // eslint-disable-next-line
  const [categories, setCategories] = useState(["Vegetables", "Meat", "Bread", "Eggs", "Milk"]); //main categories of the products

  const [date, setDate] = useState(new Date()); //virtual clock date
  const [dirty, setDirty] = useState(false); ///?????

  const [farmers, setFarmers] = useState([]);

  const [logged, setLogged] = useState(''); //this state is used to store the type of the user logged
  // eslint-disable-next-line
  const [username, setUsername] = useState(''); //this state saves the name of the logged user
  const [userId, setUserId] = useState(0); //this state saves the id of the logged user
  const [showTopUpWalletModal, setShowTopUpWalletModal] = useState(false);
  const [notify, setNotify] = useState(false);

  const [products, setProducts] = useState([]);
  const [dirtyAvailability, setDirtyAvailability] = useState(true); //state used to indicate if the availability of some product has been changed

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState([]); //????????????????????????
  const [dirtyClients, setDirtyClients] = useState(true); //state used to indicate if a new user has been added
  const [clientOrders, setClientOrders] = useState([]);

  const [resultOrder, setResultOrder] = useState() //??????????????

  const [order, setOrder] = useState({}); //??????????????????????????

  const [errorMessage, setErrorMessage] = useState(); //???????????????????

  const [showBasket, setShowBasket] = useState(false); //this state controls the basked offcanvas
  const [dirtyBasket, setDirtyBasket] = useState(true); //this state controls the update of the basket in the offcanvas
  const [dirtyQuantity, setDirtyQuantity] = useState([]); //this state is used to fix the local available quantity once the elements are deleted from the basket

  //this use effect checks whether the user logged in previously
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUserInfo();
        setUsername(user.name);
        setLogged(user.type);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  //this use effect is used to show the modal when the client logs in  
  useEffect(() => {
    async function fetchdata() {
      console.log(logged);
      if (logged === "client") {
        let res = await getClientById(userId);
        setClient(res);
        if (res.userid === userId && parseInt(res.wallet) < 10) {
          setShowTopUpWalletModal(true);
          console.log("qua3")
          setNotify(true);
        } else setNotify(false);
      }
    }
    fetchdata();
  }, [logged, userId]);

  const [messageProductRequest, setMessageProductRequest] = useState({
    type: "",
    show: false,
    text: ""
  })

  useEffect(() => {
    async function fetchdata() {
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
          }).catch(err => { console.log(err); })
        setDirty(false);
      }
    }
    fetchdata();
  }, [dirty, order]);

  return (
    <>
      <Router>
        <Route path="/">
          <MyNav
            logged={logged}
            date={date}
            setDate={setDate}
            logout={logout} setLogged={setLogged}
            showBasket={showBasket} setShowBasket={setShowBasket}
            dirtyBasket={dirtyBasket} setDirtyBasket={setDirtyBasket}
            userId={userId}
            setDirtyQuantity={setDirtyQuantity}
            className="myNav"
            setDirtyAvailability={setDirtyAvailability}
            topUpWallet={notify}
          />
          <MyModal
            userid={client.userid}
            show={showTopUpWalletModal}
            close={() => setShowTopUpWalletModal(false)}
          />
        </Route>

        <Route exact path='/products' render={() =>
          <ProductsList
            products={products} setProducts={setProducts}
            categories={categories}
            farmers={farmers} setFarmers={setFarmers}
            logged={logged} date={date}
            dirtyAvailability={dirtyAvailability} setDirtyAvailability={setDirtyAvailability}
            date={date}
            setDirtyBasket={setDirtyBasket}
            dirtyQuantity={dirtyQuantity} setDirtyQuantity={setDirtyQuantity}
          />
        } />

        <Route exact path='/' render={() => <Home />} />

        <Route exact path='/employeehome' render={() => <ShopEmployeeHome />} />

        <Route exact path='/clienthome' render={() => <ClientHome />} />

        <Route exact path='/wallet' render={() => <Wallet
          clients={clients}
          setClients={setClients}
          dirtyClients={dirtyClients}
          setDirtyClients={setDirtyClients}
          logged={logged}
          date={date} />}
        />

        <Route exact path='/productRequest' render={() =>
          <ProductRequest
            farmers={farmers}
            clients={clients}
            setClients={setClients}
            dirtyClients={dirtyClients}
            setDirtyClients={setDirtyClients}
            products={products}
            order={order}
            setOrder={setOrder}
            setDirty={() => setDirty(true)}
            message={messageProductRequest}
            setMessage={setMessageProductRequest}
            setDirtyAvailability={setDirtyAvailability}
            logged={logged}
            date={date} />}
        />

        <Route exact path="/handout" render={() =>
          <Handout
            clients={clients}
            setClients={setClients}
            dirtyClients={dirtyClients}
            setDirtyClients={setDirtyClients}
            orders={clientOrders}
            setOrders={setClientOrders}
            logged={logged}
            date={date} />}
        />

        <Route exact path="/registerClient" render={() => <Register setDirtyClients={setDirtyClients} logged={logged}
        />} />

        <Route exact path="/login" render={() => <LoginForm login={login} setLogged={setLogged} setUser={setUsername} setUserId={setUserId} />} />

        <Route exact path="/user" render={() => <Type />} />

        <Route exact path="/user/:type" render={({ match }) => <RegisterUser st={(match.params.type === "client") ? 1 : (match.params.type === "farmer") ? 2 : 3} type={match.params.type} />} />

        <Route exact path="/user/client/password" render={() => <UpdatePassword />} />

      </Router>
    </>
  );
}

export default App;
