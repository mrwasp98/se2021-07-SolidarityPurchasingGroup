import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MyNav from "./Components/Navbar/MyNav";
import { LoginForm } from "./Components/LoginForm";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import ProductsList from "./Components/ProductsList/ProductsList"
import ProductRequest from "./Components/ProductRequest";
import Handout from "./Components/Handout/Handout";
import Register from "./Components/Register";
import Type from "./Components/Type";
import UpdatePassword from "./Components/UpdatePassword";
import RegisterUser from "./Components/RegisterUser";
import { login, getUserInfo, logout, getClientById, insertProduct, updateProduct } from "./API/API.js";
import ShopEmployeeHome from "./Components/Homepages/ShopEmployeeHome";
import Home from "./Components/Homepages/Home.js"
import ClientHome from "./Components/Homepages/ClientHome";
import Wallet from "./Components/Wallet";
import MyModal from "./Components/MyModal";
import ManageOrders from "./Components/ManageOrders/ManageOrders";
import ReportAvailability from "./Components/ReportAvailability";
import ProductForm from "./Components/ProductForm";
import TelegramBot from "node-telegram-bot-api";
import ManagerHome from "./Components/Homepages/ManagerHome";

function App() {

  const [somethingInTheBasket, setSomethingInTheBasket] = useState(false);
  
  ///TELEGRAM STUFF
  // replace the value below with the Telegram token you receive from @BotFather
  const token = '5025601538:AAFbffT0RV-Xn5XmwQYX6xwAFToAwK_QbJk';

  const [bot, setBot] = useState(0);
  const [chatIds, setChatIds] = useState([]);
  const [telegramStarted, setTelegramStarted] = useState(false);
  const [firstBoot, setFirstBoot] = useState(true);

  //this use effect is for telegram stuff
  useEffect(() => {
    if (firstBoot === true && !bot) {
      setFirstBoot(false);
      // Create a bot that uses 'polling' to fetch new updates
      setBot(new TelegramBot(token, { polling: true }));
    }
    else {
      bot.onText(/\/start/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message
        let chatIdtemp = 0;
        chatIdtemp = msg.chat.id;
        setChatIds(chatIds => [...chatIds, chatIdtemp]);
        setTelegramStarted(true);
        bot.sendMessage(chatIdtemp, "SPG-Bot started 🚀!");
        bot.sendMessage(chatIdtemp, "Welcome " + msg.from.username + "! 👋\nThis is SPG-G07 bot, here you here you will receive notifications when the farmers make the weekly products available 📅.");
      });

      // Listen for any kind of message. There are different kinds of
      // messages.
      bot.on('message', (msg) => {
        // send a message to the chat acknowledging receipt of their message
        //bot.sendMessage(chatId, 'Received your message');
      });
    }
    // eslint-disable-next-line
  }, [firstBoot]);


  // eslint-disable-next-line
  const [categories, setCategories] = useState(["Vegetables", "Meat", "Bread", "Eggs", "Milk"]); //main categories of the products
  const [date, setDate] = useState(new Date()); //virtual clock date

  const [farmers, setFarmers] = useState([]); //farmers present in the system

  const [logged, setLogged] = useState(''); //this state is used to store the type of the user logged
  const [username, setUsername] = useState(''); //this state saves the name of the logged user
  const [userId, setUserId] = useState(0); //this state saves the id of the logged user
  const [clientAddress, setClientAddress] = useState('');
  const [showTopUpWalletModal, setShowTopUpWalletModal] = useState(false);
  const [notify, setNotify] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [dirtyAvailability, setDirtyAvailability] = useState(true); //state used to indicate if the availability of some product has been changed

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState([]); //????????????????????????
  const [dirtyClients, setDirtyClients] = useState(true); //state used to indicate if a new user has been added
  const [clientOrders, setClientOrders] = useState([]);

  const [failedOrders, setFailedOrders] = useState([]);

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
        setUserId(user.id);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  //this use effect is used to show the modal when the client logs in  
  useEffect(() => {
    async function fetchdata() {
      if (logged === "client") {
        let res = await getClientById(userId);
        setClientAddress(res.address);
        setClient(res);
        if (res.userid === userId && parseInt(res.wallet) < 10) {
          setShowTopUpWalletModal(true);
          setNotify(true);
        } else {
          setNotify(false);
        }
      }
    }
    fetchdata();
  }, [logged, userId]);

  const editProduct = (product) => {
    updateProduct(product);
  }

  const addProduct = (product) => {
    insertProduct(product);
  }


  return (
    <>
      <Router>
        <Route path="/">
          <MyNav
            somethingInTheBasket={somethingInTheBasket}
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
            clientAddress={clientAddress}
            setSomethingInTheBasket={setSomethingInTheBasket}
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
            setDirtyBasket={setDirtyBasket}
            dirtyQuantity={dirtyQuantity} setDirtyQuantity={setDirtyQuantity}
            setSomethingInTheBasket={setSomethingInTheBasket}
          />
        } />

        <Route exact path='/' render={() => <Home />} />

        <Route exact path='/farmerhome' render={() => <ReportAvailability telegramStarted={telegramStarted} username={username} userId={userId} date={date} bot={bot} chatIds={chatIds} />} />
        <Route exact path='/editProduct' render={() => <ProductForm username={username} editProduct={editProduct} />} />
        <Route exact path='/addProduct' render={() => <ProductForm username={username} addProduct={addProduct} userId={userId} />} />

        <Route exact path='/employeehome' render={() => <ShopEmployeeHome />} />
        <Route exact path='/managerhome' render={() => <ManagerHome date={date} />} />

        <Route exact path='/clienthome' render={() => <ClientHome />} />

        <Route path='/wallet/:id' render={() =>
          <>
            {logged === "shopemployee" ?
              <Wallet
                clients={clients}
                setClients={setClients}
                dirtyClients={dirtyClients}
                setDirtyClients={setDirtyClients}
                logged={logged}
                date={date} />
              :
              <LoginForm login={login} setLogged={setLogged} setUser={setUsername} setUserId={setUserId} wallet={true} />
            }

          </>
        } />

        <Route exact path='/productRequest' render={() =>
          <ProductRequest
            farmers={farmers}
            clients={clients}
            setClients={setClients}
            dirtyClients={dirtyClients}
            setDirtyClients={setDirtyClients}
            products={products}
            setProducts={setProducts}
            setDirtyAvailability={setDirtyAvailability}
            logged={logged}
            date={date} />}
        />

        <Route exact path="/manageOrders" render={() =>
          <ManageOrders
            clients={clients}
            setClients={setClients}
            dirtyClients={dirtyClients}
            setDirtyClients={setDirtyClients}
            orders={clientOrders}
            logged={logged}
            date={date}
            failedOrders={failedOrders}
            setFailedOrders={setFailedOrders}
          />}
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
