import { Navbar, Container, Button } from "react-bootstrap";
import dayjs from "dayjs";
import { iconStar, iconPerson, iconCalendar } from "./Icons";

export default function MyNav(props) {
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
          <small>Curent Date: {dayjs().format("DD/MM/YYYY").toString()}{"  "}{iconCalendar}</small>
          <Navbar.Text>
            {iconPerson}{" "}
            {props.IsLogin ? (
              <Button variant="link">Logout</Button>
            ) : (
              <>
                {" "}
                <Button variant="link">Login</Button>
                <Button variant="link">Register</Button>{" "}
              </>
            )}{" "}
          </Navbar.Text>
        </Container>
      </Navbar>
    </>
  );
}