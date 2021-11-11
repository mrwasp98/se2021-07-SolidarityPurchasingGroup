import { useEffect, useState } from "react";
import { Card, Container, Button, Form, ListGroup, ListGroupItem, Collapse } from "react-bootstrap";
import React, { Component } from 'react'
import Select from 'react-select'
import { Link } from "react-router-dom";
import { getClients } from "../API/API"
import OrderToggle from "./OrderToggle";

export default function Handout(props) {

    const [selectedClient, setSelectedClient] = useState(""); //this state controls the Select input
    const [options, setOptions] = useState([]); //this state is used to store the information in props.clients in the format that works with the Select 

    /*used to get all the clients when the component is being loaded
    then, converts the information in the best format to show options in the Select input*/
    useEffect(() => {
        if (props.clients.length == 0) {
            getClients()
                .then((res) => {
                    props.setClients(res)
                    setOptions(res.map((e) => {
                        return { value: e.userid, label: e.name + " " + e.surname + " - " + e.address }
                    }))
                })
        }
    }, [props.clients, props.setClients]);

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
                                <Select options={options} onChange={(event) => setSelectedClient(event.value)} />
                            </Form>
                        </Card.Body>
                    </ListGroupItem>
                    {selectedClient &&
                        <>
                            <ListGroupItem className="p-0">
                                <Card.Header>Then, select <b>the order</b>.</Card.Header>
                                <Card.Body>

                                    {props.orders.length == 0 ?
                                        <span>Non c'è nessun ordine</span>
                                        :
                                        <ListGroup>
                                            {props.orders.map((o, i) => {
                                                if (o.userid == selectedClient) { /* TODO: elimina */
                                                    return (
                                                        <OrderToggle order={o} chiave={i} key={i} />
                                                    )
                                                }
                                            })}
                                        </ListGroup>
                                    }

                                </Card.Body>
                            </ListGroupItem>
                            <Card.Body>
                                <Container className="d-flex justify-content-start">
                                    <Link style={{ textDecoration: "none", hover: "black" }} to="/" className="linkred">
                                        <Button variant="outline-danger" type="submit" className="mr-3" size="lg">Back</Button>
                                    </Link>
                                </Container>
                            </Card.Body>
                        </>
                    }
                </ListGroup>
            </Card>
        </Container>
    )
}