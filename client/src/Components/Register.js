import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { addClient } from "../API/API.js";
import HomeButton from "./HomeButton";

export default function Register(props) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [address, setAddress] = useState("");
  const [inserted, setInserted] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      addClient(name, surname, email, wallet, address, "abc123", "client-prov")
        .then((data) => {
          setInserted(true);
          setName("");
          setSurname("");
          setEmail("");
          setWallet("");
          setAddress("");
          props.setDirtyClients(true);
        })
        .catch((errorObj) => { console.log(errorObj); });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setInserted(false);
    }, 5000);
  }, [inserted]);

  return (
    <Container className="mt-5 ">
      <Row className=" justify-content-center">
        <Col md={6}>
          {" "}
          {inserted ? (
            <Alert className="alert-success" key={155} variant={"success"}>
              The user has been created
            </Alert>
          ) : (
            ""
          )}
          <h3> Register new client</h3>
          <Form className="mt-5 " onSubmit={(event) => submit(event)}>
            <Form.Group as={Row} className="mb-3" controlId="formBasicNama">
              <Form.Label column sm="2">
                Name:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  required
                  onChange={(ev) => setName(ev.target.value)}
                  value={name}
                  className="name-input"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicSurname">
              <Form.Label column sm="2">
                Surname:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="surname"
                  required
                  className="surname-input"
                  onChange={(ev) => setSurname(ev.target.value)}
                  value={surname}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="2">
                Email:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  required
                  className="email-input"
                  onChange={(ev) => setEmail(ev.target.value)}
                  value={email}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicWallet">
              <Form.Label column sm="2">
                Wallet:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Wallet"
                  required
                  className="wallet-input"
                  onChange={(ev) => setWallet(ev.target.value)}
                  value={wallet}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicAddress">
              <Form.Label column sm="2">
                Address:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Address"
                  required
                  className="address-input"
                  onChange={(ev) => setAddress(ev.target.value)}
                  value={address}
                />
              </Col>
            </Form.Group>

            <Container className="d-flex justify-content-end my-4">
              <Button variant="yellow" type="submit" className="submit-btn">Submit</Button>
            </Container>
          </Form>
        </Col>
      </Row>
      <HomeButton logged={props.logged} />
    </Container>
  );
}
