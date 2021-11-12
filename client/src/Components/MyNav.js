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

  return (
    <>
      <Navbar
        className="justify-content-between NavBar-Background text-warning"
        expand="sm"
      >
        <Container fluid>
          <Navbar.Brand>
            {iconStar}
            <span> SPG - Group 07</span>
          </Navbar.Brand>
          < div className="">
          <Button
            variant="light"
            onClick={toggleShow}
            className="callandarButton"
          >
            Current Date: {value.getDate()}/{value.getMonth() + 1}/
            {value.getFullYear()}
            {"  "}
            {iconCalendar}
          </Button>
          {show ? (
        <Calendar className="position-absolute" onChange={onChange} value={value} />
      ) : (
        ""
      )}

          </div>
          <Navbar.Text>
            {iconPerson}{" "}
            {props.IsLogin ? (
              <Button variant="link">Logout</Button>
            ) : (
              <>
                {" "}
                <Link to= "/login">
                  <Button variant="link">Login</Button>
                </Link>
                <Button variant="link">Register</Button>{" "}
              </>
            )}{" "}
          </Navbar.Text>
        </Container>
      </Navbar>

    </>
  );
}
