import { useHistory } from 'react-router-dom';
import { Navbar, Container, Button, Modal, Row, Col, Table } from "react-bootstrap";
import { useState } from "react";
import { clock, iconStar, iconPerson, iconCalendar, iconCart, cartFill, cross, coin } from "./Icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import Clock from "./Clock";

import { Offcanvas } from "react-bootstrap";
import React from 'react';
import { useEffect } from 'react';

export default function MyNav(props) {

  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const toggleShow = () => setShow(!show);
  var date = dayjs(props.date)
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

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
  const handleShowBasket = () => {
    console.log("chiamata!")
    props.setShowBasket(true)
  }


  return (
    <>
      <Navbar className="justify-content-between NavBar-Background text-warning myNav" expand="sm">
        <Container fluid>
          <Navbar.Brand style={{ fontSize: "25px" }}>
            <a href="/" className="nounderline">
              {iconStar}
              <span> SPG - Group 07</span></a>
          </Navbar.Brand>
          < div className="">
            <Button variant="light" onClick={toggleShow} className="me-2 callandarButton" style={{ fontSize: "17px" }}>
              {iconCalendar}
              {date.format('ddd DD MMM')}
            </Button>
            <Button variant="light" onClick={toggleShowHour} className="btn-hour">
              {clock}
              {date.format('HH:mm')}
            </Button>
            {show ? (
              <Calendar className="position-absolute priority react-calendar" onChange={handleCalendar} style={{ color: "#0f8b8b" }} value={props.date} />
            ) : (
              ""
            )}
            <Modal className="" show={showHour} onHide={() => !showHour} animation={false}>
              <Modal.Body>
                <Row className="mt-3 ps-3 pe-3 mb-2">
                  <Col className="col-3" style={{ "fontWeight": "600" }}><p>Select hour: </p></Col>
                  <Col className="col-9" ><input
                    className="input-hour"
                    type="number"
                    min={0}
                    max={24}
                    step={1}
                    value={hour}
                    onChange={e => setHour(e.target.value)}
                  /></Col>
                </Row>
                <hr className="p-0 m-0 mb-3" />
                <Row className="ps-3 pe-3" style={{ "fontWeight": "600" }}>
                  <Col className="col-3"><p>Select min: </p></Col>
                  <Col className="col-9"><input
                    className="input-hour"
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
                <Button variant="secondary" onClick={() => { setShowHour(false) }} style={{ 'backgroundColor': "#143642" }}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleModal} style={{ fontSize: "17px", "fontWeight": "500" }}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <Navbar.Text>
            {iconPerson}{" "}
            {props.logged ? (
              <>
                <Button variant="link" style={{ color: "#ec9a2a", fontSize: "20px", textDecoration: "none" }} onClick={handleLogout} id="logoutbutton">Logout</Button>
                {props.logged === "client" && <Button className="ml-2" onClick={() => handleShowBasket()}>{iconCart}</Button>}
              </>
            ) : (
              <>
                {" "}
                <Link to="/login">
                  <Button variant="link" style={{ fontSize: "20px", color: "#ec9a2a" }} className="btn-login">Login</Button>
                </Link>
                <Button variant="link" style={{ fontSize: "20px", color: "#ec9a2a" }} className="btn-reg">Register</Button>{" "}
              </>
            )}{" "}
          </Navbar.Text>
        </Container>
      </Navbar>

      <BasketOffCanvas showBasket={props.showBasket} setShowBasket={props.setShowBasket}
        dirtyBasket={props.dirtyBasket} setDirtyBasket={props.setDirtyBasket} setDirtyQuantity={props.setDirtyQuantity}
        userId={props.userId}
      />
    </>
  );
}

function BasketOffCanvas(props) {

  const [elements, setElements] = useState([]);

  //function called to close the offcanvas
  const handleClose = () => props.setShowBasket(false);

  useEffect(() => {
    if (props.dirtyBasket) {
      if (sessionStorage.length > 0) {
        setElements(JSON.parse(sessionStorage.getItem("productList")))
      }
      props.setDirtyBasket(false);
    }

  }, [props.dirtyBasket, props.setDirtyBasket])

  function handleClick(id, quantity) {
    if (sessionStorage.length > 0) {
      let list = JSON.parse(sessionStorage.getItem("productList"));
      let info = [id, quantity ]
      list = list.filter((el) => el.productid !== id)
      sessionStorage.setItem("productList", JSON.stringify(list))
      props.setDirtyBasket(true)
      props.setDirtyQuantity(info)
    }
  }

  return (
    <Offcanvas show={props.showBasket} placement="end" onHide={handleClose} {...props} style={{ "backgroundColor": "#FFF3E0", color: "#5E3A08" }}>
      <Offcanvas.Header closeButton className="division">
        <Offcanvas.Title className="d-flex align-items-center" style={{ fontSize: "28px" }}>
          {cartFill} {'\u00A0'} This is your <strong>{'\u00A0'}basket</strong></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Offcanvas.Title style={{ fontSize: "30px", "fontWeight": "600" }}>Selected Items</Offcanvas.Title>
        {elements && elements.length > 0 ?
          <Table hover size="sm" className="mt-3">
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>

            <tbody >
              {elements.map((el, index) => {
                return (
                  <tr key={index}>
                    {Object.keys(el).map((val, i) => {
                      return val !== "productid" && val !== "measure" && val !== "price" &&
                        <td key={i}>{el[val]}</td>
                    })}
                    <Button onClick={() => { handleClick(el.productid, el.quantity) }}>{cross}</Button>
                  </tr>
                )

              })}

            </tbody>
          </Table>
          :
          <p className="mt-3">Your basket is currently empty.</p>
        }
        <Button className="order-btn fixed-bottom " style={{position: "absolute", left:"8.5rem", bottom:"1rem"}} variant="yellow">
          <span style={{position: "relative", bottom:"0.1rem"}}>{coin}</span> Check and order</Button>

      </Offcanvas.Body>
    </Offcanvas>
  )
}