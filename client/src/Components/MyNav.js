import { useHistory } from 'react-router-dom';
import { Navbar, Container, Button, Modal, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { clock, iconStar, iconPerson, iconCalendar, iconCart } from "./Icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import Clock from "./Clock";

export default function MyNav(props) {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const toggleShow = () => setShow(!show);
  const toggleShowHour = () => {
    setShow(false);
    setShowHour(!show)
  };
  const handleLogout = async () => {
    await props.logout();
    props.setLogged(false);
    history.push("/")

  }
  var date = dayjs(props.date)
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

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

  return (
    <>
      <Navbar
        className="justify-content-between NavBar-Background text-warning myNav"
        expand="sm"
      >
        <Container fluid>
          <Navbar.Brand style={{ fontSize: "25px" }}>
            {iconStar}
            <span> SPG - Group 07</span>
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
                <Clock size={200} date={props.date} timeFormat="24hour" hourFormat="standard" />
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
                {props.logged === "client" && <Button className="ml-2">{iconCart}</Button>}
                {/* TODO: add the function to open the sidebar */}
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

    </>
  );
}
