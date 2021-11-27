import { Container, Form, Button, Row, Col, Alert, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUsernames, updatePassword } from "../API/API.js";
import { iconStar } from "./Icons";

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

export default function UpdatePassword(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [usernames, setUsernames] = useState([]);
  const [inserted, setInserted] = useState(false);
  const [error, setError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [id, setId] = useState("");


  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
        let valid=false;
        let validPass= true;

        if(this.state.password!==this.state.cpassword) {
            validPass=false;
            setError(true);
            setMessageError("Passwords are not equal");
          } else if (password === '' || password.length < 6 || isAlphaNumeric(password) === false) {
            validPass=false;
            setError(true);
            setMessageError("The password must be at least 6 characters long and must contain both alphabetic and numerical values.");
          }

        usernames.map((us) => {
            if (us.username === username && us.type==="client-prov") {
              valid = true;
              setId(us.id);
            }
        });

        if(valid===true) {
            updatePassword(password, id).then(() =>{
                setInserted(true);
                setError(false);
            });
        } else {
            setMessageError("No username found");
            setError(true);
        }
    }
  };

  useEffect(() => {
    getUsernames().then((users) => {
        setUsernames(users);
    })
  }, [inserted]);

  useEffect(() => {
    setTimeout(() => {
      setInserted(false);
    }, 5000);
  }, [inserted]);

  return (
    <Container className='login-form text-warning'>
        <Col>
          <h2 align="center">{iconStar}&nbsp;New Password</h2>
               {" "}
            {inserted ? (
              <Alert className="alert-success" key={155} variant={"success"}>
                Password updated
              </Alert>
            ) : (
              ""
            )}
            {" "}
            {error ? (
              <Alert className="alert-danger" key={156} variant={"danger"}>
                {messageError}
              </Alert>
            ) : (
              ""
            )}
            <Form className="mt-5 " onSubmit={(event) => submit(event)}>
            <Table className="mb-3 color">
              <Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
                <Row md={3}>
                  <Form.Label className='text-warning myText' column sm="2">
                    Username:
                  </Form.Label>
                  <Col sm="10" md={8}>
                    <Form.Control
                      placeholder="username"
                      type="text"
                      name="username"
                      required
                      onChange={(ev) => setUsername(ev.target.value)}
                      value={username}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                <Row md={3}>
                  <Form.Label className='text-warning myText' column sm="2">
                    Choose password:
                  </Form.Label>
                  <Col sm="10" md={8}>
                    <Form.Control
                      placeholder="password"
                      type="password"
                      name="password"
                      required
                      onChange={(ev) => setPassword(ev.target.value)}
                      value={password}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formBasicCPassword">
                <Row md={3}>
                  <Form.Label className='text-warning myText' column sm="2">
                    Confirm password:
                  </Form.Label>
                  <Col sm="10" md={8}>
                    <Form.Control
                      placeholder="password"
                      type="password"
                      name="cpassword"
                      required
                      onChange={(ev) => setCPassword(ev.target.value)}
                      value={cpassword}
                    />
                  </Col>
                </Row>
              </Form.Group>
              </Table>
              <Container className="d-flex justify-content-between my-4">
                <Link  to="/client">
                  <Button type='submit' variant='secondary' className="mb-2 text-white loginbutton">Back</Button>
                </Link>
                <Button type='submit' variant='warning' className="cartButton mb-2 text-white loginbutton">Confirm</Button>
              </Container>
            </Form>
          </Col>

      </Container>
  );
}
