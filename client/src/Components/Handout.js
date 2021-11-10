import { useEffect, useState } from "react";
import { Card, Container, Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import React, { Component } from 'react'
import Select from 'react-select'
import { getClients } from "../API/API"

export default function Handout(props) {

    const [selectedClient, setSelectedClient] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        getClients()
            .then((res) => {
                console.log(res)
                props.setClients(res)
                setOptions(props.clients.map((e) => { return { value: e.userid, label: e.name + " " + e.surname + " - " + e.address } }))
            })
    }, []);


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
                                <Select options={options}
                                    onChange={(event) => setSelectedClient(event.value)} />
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