import { useEffect, useState } from "react";
import { Card, Container, Form, ListGroup, ListGroupItem, Alert } from "react-bootstrap";
import React from 'react'
import Select from 'react-select'
import { getClients } from "../API/API"
import HomeButton from "./HomeButton";

export default function Wallet(props) {
    const [selectedClient, setSelectedClient] = useState(""); //this state controls the Select input
    const [options, setOptions] = useState([]); //this state is used to store the information in props.clients in the format that works with the Select 
    const [error, setError] = useState("");
    const [amount, setAmount] = useState(0);

    //this use Effect is used to load the clients when the component is loaded
    useEffect(() => {
        if (props.dirtyClients) {
            getClients()
                .then((res) => {
                    props.setClients(res)
                    props.setDirtyClients(false);
                })
        }
        if (props.clients.length !== 0) {
            setOptions(props.clients.map((e) => {
                return { value: e.userid, label: e.name + " " + e.surname + " - " + e.address }
            }))
        }
    }, [props]);

    //this function is called only when the client is selected to load their orders
    function handlechange(event) {
        let client = props.clients.filter(c => c.userid == event.value)
        setSelectedClient(client[0]);
        setAmount(0.00)
    }

    return (
        <>
            <Container className="justify-content-center mt-3" >
                <h1 className="text-center"> Top-up a client's wallet</h1>
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
                                    <Card.Header>Then, select the amount <b>to add</b>.</Card.Header>
                                    <Card.Body>
                                        Actual amount: {selectedClient.wallet}<br/>
                                        Amount to add:
                                        <input
                                            className="input-amount"
                                            type="number"
                                            min={0}
                                            max={1000}
                                            step={0.01}
                                            value={amount}
                                            onChange={e => setAmount(e.target.value)}
                                        />
                                    </Card.Body>
                                </ListGroupItem>
                            </>
                        }
                        {error && <Alert variant="danger">An error as occurred: {error}</Alert>}
                    </ListGroup>
                </Card>
                <HomeButton logged={props.logged} />
            </Container >
        </>
    );
}