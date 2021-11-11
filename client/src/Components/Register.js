import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";

export default function Register(props) {
  return (
    <Container className="mt-5 ">
      <Row className= " justify-content-center"> 
        <Col md={6} >
          <h3> Register new client</h3>
          <Form className="mt-5 ">
            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="2">Name:</Form.Label>
              <Col sm="10">
              <Form.Control type="text" placeholder="Name" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="2">Surname:</Form.Label>
              <Col sm="10">
              <Form.Control type="text" placeholder="surname" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
              <Form.Label column sm="2">Wallet:</Form.Label>
              <Col sm="10">
              <Form.Control type="text" placeholder="Wallet" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
              <Form.Label column sm="2">Address:</Form.Label>
              <Col sm="10">
              <Form.Control type="text" placeholder="Address" />
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
