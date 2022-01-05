import { useHistory, Link } from 'react-router-dom';
import { Navbar, Container, Button, Modal, Row, Col, Table, ListGroup, Alert, Offcanvas, ButtonGroup } from "react-bootstrap";
import { useState, useEffect, React } from "react";
import { clock, iconStar, iconCalendar, iconCart, cartFill, cross, coin } from "../Utilities/Icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import Clock from "./Clock";
import MyNotifications from "./MyNotifications";
import { addPRequest } from '../../API/API';
import ModalClaimDate from "../Utilities/ModalClaimDate"
import ModalEnd from '../Utilities/ModalEnd';

export default function MyNav(props) {

  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const toggleShow = () => setShow(!show);
  var date = dayjs(props.date)
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);
  const [message, setMessage] = useState([]);
  // eslint-disable-next-line
  const [notifyMessage, setNotifyMessage] = useState({
    topUpWallet: props.topUpWallet
  });

  const toggleShowHour = () => {
    setShow(false);
    setShowHour(!show)
  };

  const handleLogout = async () => {
    await props.logout();
    props.setLogged(false);
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
                  {props.logged === "client" && <MyNotifications message={notifyMessage} />}
                  {" "}
                  {props.logged === "client" && <Button className="ml-2" onClick={() => handleShowBasket()}>{iconCart}</Button>}
                </ButtonGroup>
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
      {message.length > 0 && <Alert className="m-0 w-100" style={{ position: "absolute", zIndex: "2" }} variant={message[0]}>{message[1]}</Alert>}
      <BasketOffCanvas showBasket={props.showBasket} setShowBasket={props.setShowBasket} clientAddress={props.clientAddress}
        dirtyBasket={props.dirtyBasket} setDirtyBasket={props.setDirtyBasket} setDirtyQuantity={props.setDirtyQuantity}
        userId={props.userId} date={props.date} setMessage={setMessage} setDirtyAvailability={props.setDirtyAvailability}
      />


    </>
  );
}

function BasketOffCanvas(props) {
  const [elements, setElements] = useState([]); //these are the selected products
  const [claimdate, setClaimdate] = useState(new Date());
  const [showModalClaim, setShowModalClaim] = useState(false) //this is used for the "claim date modal", shows up after clicking "continue"
  const [showModal, setShowModal] = useState(false); //this is used for the "recap modal", shows up at the confirmation of the order
  const [deliveryAddress, setDeliveryAddress] = useState(() => { return props.clientAddress });


  let total;
  //function called to close the offcanvas
  const handleClose = () => props.setShowBasket(false);

  //function called to close the end modal
  const handleCloseModal = () => {
    console.log("chiamata!")
    //clean up of everything:
    sessionStorage.removeItem("productList")
    setElements([])
    props.setDirtyAvailability(true)
  }


  //this use effect is used to update the basket!
  useEffect(() => {
    if (props.dirtyBasket) {
      if (sessionStorage.length > 0) {
        setElements(JSON.parse(sessionStorage.getItem("productList")))
      }
      props.setDirtyBasket(false);
    }
    // eslint-disable-next-line
  }, [props.dirtyBasket, props.setDirtyBasket])

  //this use effect does the cleanup if the date changes
  useEffect(() => {
    sessionStorage.removeItem("productList")
    setElements([])
  }, [props.date])

  //this is used to adjust the quantity if something is removed from the basket
  function handleClick(id, quantity) {
    if (sessionStorage.length > 0) {
      let list = JSON.parse(sessionStorage.getItem("productList"));
      let info = [id, quantity]
      list = list.filter((el) => el.productid !== id)
      sessionStorage.setItem("productList", JSON.stringify(list))
      props.setDirtyBasket(true)
      props.setDirtyQuantity(info)
    }
  }

  function getTotal() {
    if (sessionStorage.length > 0) {
      let list = JSON.parse(sessionStorage.getItem("productList"));
      let tot = parseFloat(list.reduce((partial_sum, product) => {
        return partial_sum + parseFloat(product.subtotal)
      }, 0)).toFixed(2)
      total = tot
    }
    return total
  }

  function checkAndOrder() {
    addPRequest(props.userId,
      props.date,
      dayjs(claimdate).format("dd-mm-yyyy HH:mm"),
      null,
      deliveryAddress,
      null,
      "pending",
      elements)
      .then(result => {
        if (result.status !== undefined && result.status === 406) {
          props.setMessage(["danger", result.listofProducts.map(x => x.name + " ").concat("are not available")])
        }
        else if (result.status !== undefined && result.status === 200) {
          props.setMessage(["success", "Order received!"])
          setShowModal(true);
        }
      }).catch(err => { props.setMessage(["danger", err.message]) })
      .finally(() => {
        props.setShowBasket(false)
      })

  }

  return (
    <>
      {showModalClaim &&
        <ModalClaimDate show={showModalClaim}
          setShow={setShowModalClaim}
          claimdate={claimdate}
          setClaimdate={setClaimdate}
          handleOrder={checkAndOrder}
          clientAddress={props.clientAddress}
          address={deliveryAddress}
          setAddress={setDeliveryAddress}
        />}

      {showModal &&
        <ModalEnd
          showModal={showModal} setShowModal={setShowModal}
          handleCloseModal={handleCloseModal}
          products={{ summary: elements, total: getTotal() }}
          setDirtyAvailability={props.setDirtyAvailability}
        />}

      <Offcanvas show={props.showBasket} placement="end" onHide={handleClose} {...props} style={{ "backgroundColor": "#FFF3E0", color: "#5E3A08" }}>
        <Offcanvas.Header closeButton className="division">
          <Offcanvas.Title className="d-flex align-items-center" style={{ fontSize: "28px" }}>
            {cartFill} {'\u00A0'} This is your <strong>{'\u00A0'}basket</strong></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ maxHeight: "75vh" }}>
          <Offcanvas.Title style={{ fontSize: "30px", "fontWeight": "600" }}>Selected Items</Offcanvas.Title>
          {elements && elements.length > 0 ?
            <>
              <Table size="sm" className="mt-3" responsive>
                <tr className="mb-0" style={{ borderBottom: "2px solid black" }}>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </Table>
              <ListGroup variant="flush">
                {elements.map((el, index) => {
                  return (
                    <>
                      <Row key={index} className={index === 0 ? "" : "mt-2"} style={{ borderBottom: "1px solid gray" }}>
                        <Row className="p-0 m-0 w-100">
                          <Col xs={5}>{el.name}</Col>
                          <Col style={{ paddingLeft: "0px" }}>{el.quantity} {el.measure} </Col>
                          <Col className="text-center">
                            <Button variant="flat" className="py-0 m-0" style={{ position: "relative", bottom: "0.2rem" }} onClick={() => { handleClick(el.productid, el.quantity) }}>{cross}</Button>
                          </Col>
                        </Row>
                        <Row className="m-0 p-0 " style={{ fontSize: "0.7rem" }}>
                          <span className="text-muted pb-1 p-0" style={{ position: "relative", left: "8rem", maxWidth: "7rem" }} > Subtotal: {parseFloat(el.subtotal).toFixed(2)} €</span>
                        </Row>
                      </Row>
                    </>
                  )
                })}
              </ListGroup>
            </>

            :
            <p className="mt-3">Your basket is currently empty.</p>
          }
          {elements && elements.length > 0 &&
            <Container className="fixed-bottom" style={{ position: "absolute", maxHeigh: "25vh" }}>
              <Row style={{ position: "relative", bottom: "3rem", left: "0.5rem" }} className="mb-3 division">
                <Col><strong>Total:</strong></Col>
                <Col md={{ span: 3, offset:  2}} style={{fontSize:"20px"}}><strong>{getTotal()} €</strong></Col>
              </Row>
              <Button className="order-btn" style={{ position: "absolute", right: "10px", bottom: "10px" }}
                disabled={!(elements && elements.length > 0)} variant="yellow"
                onClick={() => setShowModalClaim(true)}>
                <span style={{ position: "relative", bottom: "0.1rem" }}>{coin}</span> Done!
              </Button>
            </Container>
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

