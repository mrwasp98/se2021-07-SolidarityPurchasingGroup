import { Navbar, Container, Button} from "react-bootstrap";
import { Link } from 'react-router-dom';
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
          <small>Current Date: {dayjs().format("DD/MM/YYYY").toString()}{"  "}{iconCalendar}</small>
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
