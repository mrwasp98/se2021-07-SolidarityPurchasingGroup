import { useState } from "react";
import { Card, Container, Button, Form, Row, ListGroup, ListGroupItem } from "react-bootstrap";

export default function Handout(props) {

    const [selectedClient, setSelectedClient] = useState("");

    return (
        <Container className="justify-content-center mt-3">
            <h1 className="text-center">Record product handout.</h1>
            <Card className="text-left mt-4">
                <ListGroup className="list-group-flush">
                    <ListGroupItem className="p-0">
                        <Card.Header>
                            First, select <b>the client</b>.
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Select onChange={(ev) => setSelectedClient(ev.target.value)}>
                                    <option disabled> Select the client </option>
                                    {props.clients.map((el, ind) => {
                                        return (
                                            <option key={ind}>{el.name} {el.surname} - {el.address}</option>
                                        )
                                    })}
                                </Form.Select>
                            </Form>
                        </Card.Body>
                    </ListGroupItem>
                    {selectedClient &&
                        <>
                            <ListGroupItem className="p-0">
                                <Card.Header>Then, select <b>the order</b>.</Card.Header>
                                <Card.Body>
                                    <Form>
                                        <Form.Select onChange={(ev) => setSelectedClient(ev.target.value)}>
                                            <option disabled> Select the client </option>
                                            {props.clients.map((el, ind) => {
                                                return (
                                                    <option key={ind}>{el.name} {el.surname} - {el.address}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </Form>
                                </Card.Body>
                            </ListGroupItem>
                            <Card.Body>
                                <Container className="d-flex justify-content-end">
                                    <Button variant="outline-yellow" type="submit" className="mr-3">Confirm Handout</Button>
                                </Container>
                            </Card.Body>
                        </>
                    }
                </ListGroup>
            </Card>
        </Container>
    )
}