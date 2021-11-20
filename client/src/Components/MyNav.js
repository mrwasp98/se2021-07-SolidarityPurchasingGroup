import { useHistory } from 'react-router-dom';
import { Navbar, Container, Button } from "react-bootstrap";
import { useState } from "react";
import { clock, iconStar, iconPerson, iconCalendar } from "./Icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
export default function MyNav(props) {
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const toggleShow = () => setShow(!show);
  const toggleShowHour = () => setShowHour(!show);
  const handleLogout = async () => {
    await props.logout();
    props.setLogged(false);
    history.push("/")

  }
  var date = dayjs(props.date)

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
              {date.format('ddd')}
            </Button>
            <Button variant="light" onClick={toggleShowHour} className="btn-hour">
              {clock}
              {date.format('HH:mm')}
            </Button>
            {show ? (
              <Calendar className="position-absolute priority react-calendar" onChange={props.setDate} date={props.date} />
            ) : (
              ""
            )}

          </div>
          <Navbar.Text>
            {iconPerson}{" "}
            {props.IsLogin ? (
              <Button variant="link" onClick={handleLogout} id="logoutbutton">Logout</Button>
            ) : (
              <>
                {" "}
                <Link to="/login">
                  <Button variant="link" style={{ fontSize: "20px" }} className="btn-login" style={{color:"#ec9a2a"}}>Login</Button>
                </Link>
                <Button variant="link" style={{ fontSize: "20px", color:"#ec9a2a" }} className="btn-reg">Register</Button>{" "}
              </>
            )}{" "}
          </Navbar.Text>
        </Container>
      </Navbar>

    </>
  );
}
