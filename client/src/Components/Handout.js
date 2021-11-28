import { useEffect, useState } from "react";
import { Card, Container, Form, ListGroup, ListGroupItem, Alert } from "react-bootstrap";
import React from 'react'
import Select from 'react-select'
import { getClients, getClientOrders } from "../API/API"
import OrderToggle from "./OrderToggle";
import HomeButton from "./HomeButton";
import dayjs from "dayjs";

export default function Handout(props) {
    const [selectedClient, setSelectedClient] = useState(""); //this state controls the Select input
    const [options, setOptions] = useState([]); //this state is used to store the information in props.clients in the format that works with the Select 
    const [error, setError] = useState("");

    /*used to get all the clients when the component is being loaded
    then, converts the information in the best format to show options in the Select input*/
    useEffect(() => {
        setError("");
        if (props.dirtyClients) {
            getClients()
                .then((res) => {
                    props.setClients(res)
                    props.setDirtyClients(false)
                })
                .catch((err) => {
                    setError(err.message);
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
        setSelectedClient(event.value);
        getClientOrders(event.value)
            .then((res) => {
                props.setOrders(res)
            })
            .catch((err) => {
                setError(err.message);
            })
    }

    let wedMorning;
    let fridEv;
    if (dayjs(props.date).format('dddd') !== 'Sunday') {
        wedMorning = dayjs(props.date).endOf('week').subtract(3, 'day').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        fridEv = dayjs(props.date).endOf('week').subtract(1, 'day').subtract(4, 'hour').subtract(59, 'minute').subtract(59, 'second')
    } else {
        wedMorning = dayjs(props.date).endOf('week').subtract(1, 'week').subtract(3, 'day').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        fridEv = dayjs(props.date).endOf('week').subtract(1, 'week').subtract(1, 'day').subtract(4, 'hour').subtract(59, 'minute').subtract(59, 'second')
    }
    return (
        <>
            {
                (dayjs(props.date).isAfter(wedMorning) && dayjs(props.date).isBefore(fridEv)) ?
                    <Container className="justify-content-center mt-3" >
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
                                                            )
                                                        })}
                                                    </ListGroup>
                                                }
                                            </Card.Body>
                                        </ListGroupItem>
                                    </>
                                }
                                {error && <Alert variant="danger">An error as occurred: {error}</Alert>}
                            </ListGroup>
                        </Card>
                        <HomeButton logged={props.logged} />
                    </Container >
                    :
                    <>
                        <Alert variant="danger" style={{ "fontWeight": "500" }}>
                            Pickups take place from Wednesday morning at 9 am until Friday evening at 7 pm 
                        </Alert>
                        <HomeButton logged={props.logged} />
                    </>
            }
        </>
    )
}