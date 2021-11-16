import { useEffect, useState } from "react";
import { Card, Container, Button, Form, ListGroup, ListGroupItem, Alert } from "react-bootstrap";
import React from 'react'
import Select from 'react-select'
import { Link } from "react-router-dom";
import { getClients, getClientOrders } from "../API/API"
import OrderToggle from "./OrderToggle";

export default function Handout(props) {

    const [selectedClient, setSelectedClient] = useState(""); //this state controls the Select input
    const [options, setOptions] = useState([]); //this state is used to store the information in props.clients in the format that works with the Select 
    const [error, setError] = useState("");
    
    /*used to get all the clients when the component is being loaded
    then, converts the information in the best format to show options in the Select input*/
    useEffect(() => {
        setError("");
        console.log("chiamata")
        if (props.clients.length === 0) {
            console.log("entro")
            getClients()
                .then((res) => {
                    props.setClients(res)
                })
                .catch((err)=>{
                    setError(err.message);
                })
        }
        if(props.clients){
            setOptions(props.clients.map((e) => {
                return { value: e.userid, label: e.name + " " + e.surname + " - " + e.address }
            }))
        }
    }, [props]);

    //this function is called only when the client is selected to load their orders
    function handlechange(event) {
        setSelectedClient(event.value);
        getClientOrders(event.value)
            .then((res) => {
                console.log(res);
                props.setOrders(res)
            })
            .catch((err)=>{
                setError(err.message);
            })
    }

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
                            <Form className="client-here">
                                <Select options={options} onChange={(event) => handlechange(event)} />
                            </Form>
                        </Card.Body>
                    </ListGroupItem>
                    {selectedClient && !error &&
                        <>
                            <ListGroupItem className="p-0">
                                <Card.Header>Then, select <b>the order</b>.</Card.Header>
                                <Card.Body>
                                    {props.orders.length === 0 ?
                                        <span>There is no order to be handed out.</span>
                                        :
                                        <ListGroup>
                                            {props.orders.map((o, i) => {
                                                return (
                                                    <OrderToggle order={o} chiave={o.id} key={i} />
                                                )})}
                                        </ListGroup>
                                    }
                                </Card.Body>
                            </ListGroupItem>
                            <Card.Body>
                                <Container className="d-flex justify-content-start">
                                    <Link style={{ textDecoration: "none", hover: "black" }} to="/" className="linkred">
                                        <Button variant="outline-danger" type="submit" className="mr-3 back-btn" size="lg">Back</Button>
                                    </Link>
                                </Container>
                            </Card.Body>
                        </>
                    }
                    {error && <Alert variant="danger">An error as occurred: {error}</Alert>}
                </ListGroup>
            </Card>
        </Container>
    )
}