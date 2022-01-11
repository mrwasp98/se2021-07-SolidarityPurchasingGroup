import { useHistory, Link } from 'react-router-dom';
import { Navbar, Container, Button, Modal, Row, Col, Alert, ButtonGroup } from "react-bootstrap";
import { useState, useEffect, React } from "react";
import { clock, iconStar, iconCalendar, iconCart } from "../Utilities/Icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import Clock from "./Clock";
import MyNotifications from "./MyNotifications";
import BasketOffCanvas from './BasketOffCanvas';
import { getSuspendedDate, getFarmers, getProductsDelivered } from '../../API/API';

export default function MyNav(props) {

  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const toggleShow = () => setShow(!show);
  var date = dayjs(props.date)
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [message, setMessage] = useState([]);
  const [suspended, setSuspended] = useState(undefined);
  const [showMissedPickups, setShowMissedPickups] = useState(true);
  const [dismiss, setDismiss] = useState(false);

  const [farmersNames, setFarmersNames] = useState([]) //TO FILL WITH GET PLACES OF FARMERS OF STORY 5

  const notifyMessage = {
    valid: (dismiss===false && (props.topUpWallet || farmersNames.length != 0 || props.client.missed_pickups > 2 || (suspended != undefined && dayjs(props.date).isBefore(suspended)))) ? true : false,
    topUpWallet: props.topUpWallet,
    missed_pickups: props.client.missed_pickups,
    productDelivered: props.farmer.delivered
  }

  async function getFarmersThatDelivered() {
    let farmersId;
    let listFarmersId = [];
    await getProductsDelivered(date).then((f) => {
      farmersId = f;
      farmersId.forEach(f => listFarmersId.push(f.farmerid))
    }).then(() => {
      getFarmers()
        .then((farmers) => {
          let fList = farmers.filter(f => listFarmersId.includes(f.userid));
          fList = fList.map(f => f.place)
          setFarmersNames(fList);
        });
    });
  }

  useEffect(() => {
    async function f() {
      await getSuspendedDate(props.user).then((d) => {
        setSuspended(d.suspended)
        console.log(d.suspended)
      });
    }
    setDismiss(false);
    if (props.logged === 'client')
      f()
    if (props.logged === 'warehouse') {
      getFarmersThatDelivered()
    }
  }, [props.logged, props.date, props.user]);

  const toggleShowHour = () => {
    setShow(false);
    setShowHour(!show)
  };

  const handleLogout = async () => {
    await props.logout();
    props.setLogged(false);
    props.setUser("")
    history.push("/")

  }

  const handleModal = () => {
    var newDate = new Date(dayjs(props.date).format('MMMM DD, YYYY ' + hour + ":" + min));
    props.setDate(newDate);
    setShowHour(false);
    date = dayjs(props.date);
  }

  const handleCalendar = (inp) => {
    props.setDate(inp);
    setShow(false);
    setHour(0);
    setMin(0);
  }

  //when the basket button in clicked, the offcanvas will show up
  const handleShowBasket = () => { props.setShowBasket(true) }

  //this use effect is used to show a message when the order is sent
  useEffect(() => {
    setTimeout(() => {
      setMessage([]);
    }, 5000);
  }, [message]);

  return (
    <>
      <Navbar className="justify-content-between NavBar-Background text-warning myNav" variant="dark" expand="sm">
        <Container fluid>

          <Navbar.Brand style={{ fontSize: "25px" }}>
            <a href="/" className="nounderline">
              {iconStar}
              <span> SPG - Group 07</span></a>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-end" >
            {show ? (
              <div>
                <Calendar className="position-absolute priority react-calendar" onChange={handleCalendar} style={{ color: "#0f8b8b" }} value={props.date} />
              </div>
            ) : (
              ""
            )}
            <Button variant="light" onClick={toggleShow} className="me-2 callandarButton" style={{ fontSize: "17px" }}>
              {iconCalendar}
              {date.format('ddd DD MMM')}
            </Button>

            <Button variant="light" onClick={toggleShowHour} className="btn-hour">
              {clock}
              {date.format('HH:mm')}
            </Button>

            <Modal className="" show={showHour} onHide={() => !showHour} animation={false}>
              <Modal.Body>
                <Row className="mt-3 ps-3 pe-3 mb-2">
                  <Col className="col-3" style={{ "fontWeight": "600" }}><p>Select hour: </p></Col>
                  <Col className="col-9" ><input
                    className="input-hour"
                    type="number"
                    min={0}
                    max={23}
                    step={1}
                    value={hour}
                    onChange={e => setHour(e.target.value)}
                  /></Col>
                </Row>
                <hr className="p-0 m-0 mb-3" />
                <Row className="ps-3 pe-3" style={{ "fontWeight": "600" }}>
                  <Col className="col-3"><p>Select min: </p></Col>
                  <Col className="col-9"><input
                    className="input-min"
                    type="number"
                    min={0}
                    max={60}
                    step={1}
                    value={min}
                    onChange={e => setMin(e.target.value)}
                  /></Col>
                </Row>
                <hr className="p-0 mt-1" />
                <Clock size={200} date={new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), hour, min)} timeFormat="24hour" hourFormat="standard" />
              </Modal.Body>
              <Modal.Footer>
                <Button className="close-btn" variant="secondary" onClick={() => { setShowHour(false) }} style={{ 'backgroundColor': "#143642" }}>
                  Close
                </Button>
                <Button className="save-btn" variant="primary" onClick={handleModal} style={{ fontSize: "17px", "fontWeight": "500" }}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Navbar.Collapse>
          <Navbar.Collapse id="navbarScroll" className="justify-content-end" >

            {props.logged ? (
              <>

                <Button className="logoutButton" variant="link" style={{ color: "#ec9a2a", fontSize: "20px", textDecoration: "none" }} onClick={handleLogout} id="logoutbutton">Logout</Button>
                <ButtonGroup >

                  {(props.logged === "client" || props.logged === "warehouse") && <MyNotifications setDismiss={setDismiss} message={notifyMessage} farmers={farmersNames} setFarmers={setFarmersNames} logged={props.logged} user={props.user} date={props.date} />}

                  {" "}
                  {props.logged === "client" && <Button className="ml-2" onClick={() => handleShowBasket()}>{iconCart}</Button>}
                </ButtonGroup>

                {props.logged === "client" && props.somethingInTheBasket === true ?
                  <Button
                    className='position-relative rounded-circle'
                    style={{ padding: "7px", width: '10px', height: '10px', top: '-5px', right: '20px', zIndex: '100', "backgroundColor": "red" }}
                  />
                  :
                  <></>
                }

                {props.logged === "client" && notifyMessage.valid === true ?
                  <Button
                    className='position-relative rounded-circle'
                    style={{ padding: "7px", width: '10px', height: '10px', top: '-5px', right: '85px', zIndex: '100', "backgroundColor": "red" }}
                  />
                  :
                  <></>}

                {props.logged === "warehouse" && farmersNames.length > 0 ?
                  <Button
                    className='position-relative rounded-circle'
                    style={{ padding: "7px", width: '10px', height: '10px', top: '-5px', right: '20px', zIndex: '100', "backgroundColor": "red" }}
                  />
                  :
                  <></>}
              </>
            ) : (
              <>
                {" "}
                <Link to="/login">
                  <Button variant="link" style={{ fontSize: "20px", color: "#ec9a2a" }} className="btn-login loginLink">Login</Button>
                </Link>
                <Link to="/user">
                  <Button variant="link" style={{ fontSize: "20px", color: "#ec9a2a" }} className="btn-reg">Register</Button>{" "}
                </Link>
              </>
            )}{" "}

          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/** ALERT FOR NOTIFY TO USER THE MISSED PICKUPS */}
      {props.logged === 'client' && props.client.name !== ' ' && (props.client.missed_pickups > 2 && props.client.missed_pickups < 5) &&
        <Alert style={{ marginBottom: '0px' }} variant="warning" show={showMissedPickups} onClose={() => setShowMissedPickups(false)} dismissible>
          <Alert.Heading>Oh {props.client.name}! There is a warning!</Alert.Heading>
          You have to take {props.client.missed_pickups} orders! Remember that you reach 5 orders not taken you'll be banned!
        </Alert>}
      {props.logged === 'client' && props.client.name !== ' ' && (suspended != undefined && dayjs(props.date).isBefore(suspended)) &&
        <Alert style={{ marginBottom: '0px' }} variant="danger">
          <Alert.Heading>Oh {props.client.name}! You are banned!</Alert.Heading>
          You have 5 to collected! Firts to create a new order you must take the pickups in warehouse
        </Alert>}
      {message.length > 0 && <Alert className="m-0 w-100" style={{ position: "absolute", zIndex: "2" }} variant={message[0]}>{message[1]}</Alert>}
      <BasketOffCanvas setSomethingInTheBasket={props.setSomethingInTheBasket} showBasket={props.showBasket} setShowBasket={props.setShowBasket} clientAddress={props.clientAddress}
        dirtyBasket={props.dirtyBasket} setDirtyBasket={props.setDirtyBasket} setDirtyQuantity={props.setDirtyQuantity}
        userId={props.userId} date={props.date} setMessage={setMessage} setDirtyAvailability={props.setDirtyAvailability}
      />

    </>
  );
}