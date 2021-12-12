import { useEffect, useState, React } from "react";
import { Card, Container, Image, Form, ListGroup, ListGroupItem, Alert, Row, Col, Button } from "react-bootstrap";
import Select from 'react-select'
import { getClients, topUpWallet } from "../API/API"
import HomeButton from "./HomeButton";
import {piggy} from "./Icons";
import { useParams } from "react-router-dom";

export default function Wallet(props) {
    let { id } = useParams();
    const [selectedClient, setSelectedClient] = useState(''); //this state controls the Select input
    const [options, setOptions] = useState([]); //this state is used to store the information in props.clients in the format that works with the Select 
    const [error, setError] = useState("");
    const [amount, setAmount] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [showGif, setShowGif] = useState(false);
    //this use Effect is used to load the clients when the component is loaded
    useEffect(() => {
        let client = props.clients.filter(c => c.userid === id)[0];
        setSelectedClient(client);
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
    }, [props, id]);

    useEffect(() => {
        if (completed) {
            setTimeout(() => {
                setShowGif(true);
                setTimeout(() => {
                    setCompleted(false);
                    setShowGif(false);
                }, 3500);
            }, 500);
        }
    }, [completed]);

    //this function is called only when the client is selected to load their orders
    function handlechange(event) {
        let client = props.clients.filter(c => c.userid === event.value)
        setSelectedClient(client[0]);
        setAmount(0.00)
    }

    const submit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            form.reportValidity();
        } else {
            topUpWallet(selectedClient.userid, amount)
                .then((data) => {
                    setSelectedClient();
                    setAmount(0);
                    setCompleted(true);
                    props.setDirtyClients(true);
                })
                .catch((errorObj) => { setError(errorObj) });
        }
    };

    return (
        <>
            <Container className="justify-content-center mt-3" >
                <h1 className="text-center"> Top-up a client's wallet</h1>
                {(completed === true && !error) ? (
                    <Alert className="alert-success" variant={"success"}>
                        The wallet has been updated!
                    </Alert>
                ) : (error) ? (
                    <Alert variant="danger">An error as occurred: {error}</Alert>
                ) : ""
                }
                <Card className="text-left mt-4">
                    <ListGroup className="list-group-flush">
                        <ListGroupItem className="p-0">
                            <Card.Header>
                                First, select <b>the client</b>.
                            </Card.Header>
                            <Card.Body>
                                <Form className="client-here">
                                    <Select value={
                                        selectedClient && options.length > 0 ?
                                            options.filter(option =>
                                                option.value === selectedClient.userid)
                                            :
                                            ''
                                    } options={options} onChange={(event) => handlechange(event)} />
                                </Form>
                            </Card.Body>
                        </ListGroupItem>
                        {selectedClient && !error &&
                            <>
                                <ListGroupItem className="p-0">
                                    <Card.Header>Then, select the amount <b>to add</b>.</Card.Header>
                                    <Card.Body>
                                        <Row className="">
                                            <Form className="" onSubmit={(event) => submit(event)}>
                                                <Form.Group as={Row} className="m-2" controlId="formBasicWallet">
                                                    <Form.Label column sm="2">
                                                        Actual wallet import:
                                                    </Form.Label>
                                                    <Col sm="9">
                                                        <Form.Control
                                                            plaintext
                                                            readOnly
                                                            value={"€ " + selectedClient.wallet}
                                                        />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group as={Row} className="m-2" controlId="formBasicAmount">
                                                    <Form.Label column sm="2">
                                                        Amount to add:
                                                    </Form.Label>
                                                    <Col sm="9">
                                                        {"€ "}
                                                        <input
                                                            className="input-amount"
                                                            type="number"
                                                            min={1}
                                                            max={1000}
                                                            step={0.01}
                                                            value={amount}
                                                            onChange={e => setAmount(e.target.value)}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Button variant="yellow" type="submit" className="submit-btn m-3" style={{ fontSize: "18px" }}>Confirm {piggy}</Button>
                                            </Form>
                                        </Row>
                                    </Card.Body>
                                </ListGroupItem>
                            </>
                        }
                    </ListGroup>
                </Card>
                {(showGif === true) ? (
                    <Row className="justify-content-center mt-2">
                        <Image src="/img/salvadanaio.gif" fluid className="myGif" />
                    </Row>
                ) : (
                    ""
                )}
                <HomeButton logged={props.logged} />
            </Container >
        </>
    );
}