import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { addClient } from "../API/API.js";

export default function Register(props) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [wallet, setWallet] = useState("");
  const [address, setAddress] = useState("");
  const [inserted, setInserted] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      addClient(name, surname, wallet, address)
        .then((data) => {
          setInserted(true);
          setName("");
          setSurname("");
          setWallet("");
          setAddress("");
        })
        .catch((errorObj) => {});
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
            <Alert key={155} variant={"success"}>
              The user has been created
            </Alert>
          ) : (
            ""
          )}
          <h3> Register new client</h3>
          <Form className="mt-5 " onSubmit={(event) => submit(event)}>
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
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
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="2">
                Surname:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="surname"
                  required
                  onChange={(ev) => setSurname(ev.target.value)}
                  value={surname}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="2">
                Wallet:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="number"
                  placeholder="Wallet"
                  required
                  onChange={(ev) => setWallet(ev.target.value)}
                  value={wallet}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
              <Form.Label column sm="2">
                Address:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="Address"
                  required
                  onChange={(ev) => setAddress(ev.target.value)}
                  value={address}
                />
              </Col>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3 ">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
