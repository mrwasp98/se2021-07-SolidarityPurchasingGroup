import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { addUser, getUsernames } from "../API/API.js";
import { iconStar } from "./Icons";
import { Link } from "react-router-dom";

function isAlphaNumeric(str) {
  var code, i, len, nNum = 0, nLett = 0;

  for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (code > 47 && code < 58) {
          nNum++;
      }
      if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
          nLett++;
      }
  }
  if (nNum === 0 || nLett === 0) {
      return false;
  }
  return true;
};

export default function Register(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [type, setType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inserted, setInserted] = useState(false);
  const [error, setError] = useState(false);
  const [usernames, setUsernames] = useState([]);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {

      let valid=true;
      //console.log(usernames);
      //console.log(type);
      //Control if has benn selected a type
      if(type==="type" || type===""){
          valid=false;
          setErrorMessage("Select an account type");
          setError(true);
          //console.log("1")
      }
      //Control if the two passwords are equal
      if(password!==cpassword) {
        valid=false;
        setError(true);
        setErrorMessage("Wrong password");
        //console.log("2")
      } else if(password === '' || password.length < 6 || isAlphaNumeric(password) === false){
        valid=false;
        setErrorMessage("The password must be at least 6 caracters long ad must contain at least one number");
        setError(true);
      }
      //console.log(username);
      //Control if the coosen username is already in the database
      usernames.map((us) => {
        if(us.username===username) {
          valid=false;
          setErrorMessage("Username already used");
          setError(true);
          //console.log(3);
        }
      })

      //console.log(valid);
      if (valid === true) {
        addUser(username, password, type).then(() => {
          setInserted(true);
          setError(false);
        });
      }

    }
  };

  useEffect(() => {
    getUsernames().then( (users) => {
      setUsernames(users);
    })
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setInserted(false);
      setError(false);
    }, 5000);
  }, [inserted]);

  return (
    <Container className='login-form text-warning'>
      <Row className=" justify-content-center">
        <Col md={10}>
          {" "}
          {inserted ? (
            <Alert className="alert-success" key={155} variant={"success"}>
              The user has been created
            </Alert>
          ) : (
            ""
          )}
          {" "}
          {error ? (
            <Alert className="alert-danger" key={156} variant={"danger"}>
              {errorMessage}
            </Alert>
          ) : (
            ""
          )}
          <h2 align="center">{iconStar}&nbsp;Join us</h2>
          <Form className="mt-5 " onSubmit={(event) => submit(event)}>
            
            <Form.Group as={Row} className="mb-3" controlId="formBasicType">
              <Row md={3}>
                <Form.Label column sm="2">
                    Account type:
                </Form.Label>
                <Col sm="10" md={8}>
                    <Form.Select aria-label="Default select example" 
                    onChange={(ev) => setType(ev.target.value)}
                    value={type}>
                        <option value="type">Type</option>
                        <option value="client">Client</option>
                        <option value="farmer">Farmer</option>
                        <option value="shopemployee">Employee</option>
                    </Form.Select>
                </Col>
                </Row>
            </Form.Group>
           
            <Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
              <Row md={3}>
              <Form.Label column sm="2">
                Username:
              </Form.Label>
              <Col sm="10" md={8}>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  required
                  className="username-input"
                  onChange={(ev) => setUsername(ev.target.value)}
                  value={username}
                />
              </Col>
              </Row>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
              <Row md={3}>
                <Form.Label column sm="2">
                  Choose a password:
                </Form.Label>
                <Col sm="10" md={8}>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    required
                    className="password-input"
                    onChange={(ev) => setPassword(ev.target.value)}
                    value={password}
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicCPassword">
              <Row md={3}>
              <Form.Label column sm="2">
                Confirm password:
              </Form.Label>
              <Col sm="10" md={8}>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  required
                  className="CPassword-input"
                  onChange={(ev) => setCPassword(ev.target.value)}
                  value={cpassword}
                />
              </Col>
              </Row>
            </Form.Group>

            <Container className="d-flex justify-content-between my-4">
              <Link style={{ textDecoration: "none", hover: "black" }} to="/" className="linkred">
                <Button variant="outline-danger" type="submit" className="back-btn">Back</Button>
              </Link>
              <Button variant="yellow" type="submit" className="submit-btn">Submit</Button>
            </Container>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
