import { Navbar, Container, Button } from "react-bootstrap";
//import dayjs from "dayjs";
import { useState } from "react";
import { iconStar, iconPerson, iconCalendar } from "./Icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from 'react-router-dom';

export default function MyNav(props) {
  const [value, onChange] = useState(new Date());
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  const handleLogout = async () => {
    await props.logout();
    props.setLogged(false);
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
            <Button variant="light" onClick={toggleShow}className="callandarButton" style={{ fontSize: "17px" }}>
              Current Date: {value.getDate()}/{value.getMonth() + 1}/
              {value.getFullYear()}
              {"  "}
              {iconCalendar}
            </Button>
            {show ? (
              <Calendar className="position-absolute priority react-calendar" onChange={onChange} value={value} />
            ) : (
              ""
            )}

          </div>
          <Navbar.Text>
            {iconPerson}{" "}
            {props.IsLogin ? (
              <Button variant="link" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                {" "}
                <Link to="/login">
                  <Button variant="link" style={{ fontSize: "20px" }} className="loginLink">Login</Button>
                </Link>
                <Button variant="link" style={{ fontSize: "20px" }}>Register</Button>{" "}
              </>
            )}{" "}
          </Navbar.Text>
        </Container>
      </Navbar>

    </>
  );
}
