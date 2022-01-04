import { useEffect, useState, React } from "react";
import { Card, ListGroup, ListGroupItem, Col, Table, Accordion, Container } from "react-bootstrap";
import { getClientOrders, getOrdersByStatus, getClients } from "../../API/API"
import HomeButton from "../Utilities/HomeButton";
import ContactClient from "./ContactClient";
import { fail, order, handout, account, euro } from "../Utilities/Icons";

export default function ManageOrders(props) {
    const [oldLength, setOldLength] = useState(0); //metodo che fa acqua, da aggiornare quando gli ordini canceled possono essere rimossi
    // eslint-disable-next-line
    const [error, setError] = useState("");

    useEffect(() => {
        if (oldLength === 0 || props.failedOrders.length !== oldLength) {
            getOrdersByStatus("pending") //da cambiare in ....
                .then((orders) => {
                    props.setFailedOrders(orders);
                    setOldLength(orders.length);
                }); //deve essere cambiato nella giusta dicitura , es "canceled"
        }
        // eslint-disable-next-line
    }, [props.failedOrders]);

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
    }, [props]);

    return (
        <>
            <Card className="text-left m-4">
                <ListGroup className="list-group-flush">
                    <ListGroupItem className="p-0">
                        <Card.Header className="alertHeader">
                            {fail} The following orders have failed
                        </Card.Header>
                        <Card.Body style={{ backgroundColor: "white" }}>
                            <ListGroup className="m-3 mt-1 mb-2">
                                {props.failedOrders.map((forder, id) => {
                                    return (
                                        <FailedOrder key={id} order={forder} clients={props.clients} />
                                    )
                                })
                                }
                            </ListGroup>
                        </Card.Body>
                    </ListGroupItem>
                </ListGroup>
            </Card>
            <HomeButton logged={props.logged} />
        </>
    );
}


function FailedOrder(props) {
    // eslint-disable-next-line
    
    let client = props.clients.filter(o => o.userid === props.order.userid)[0];
    let orderFailed = props.order;

    //this function is called in order to calculate the total price of an order.
    function totalprice() {
        if (orderFailed && orderFailed.products && orderFailed.products.length > 0) {
            return parseFloat(
                orderFailed.products.reduce((partial_sum, product) => {
                    return partial_sum + parseFloat(product.price)
                }, 0)).toFixed(2)
        }
    }

    return (
        <>
            {
                (client) ?
                    <Accordion defaultActiveKey="0" className="alertAccHeader">
                        < Accordion.Item key={props.chiave} className="mb-4" >
                            <Accordion.Header className="alertAccHeader">
                                <Container className="p-0 d-flex flex-column flex-md-row" style={{ "font-size": "18px" }}>
                                    <Col className="mt-2">{account} Account: <strong>{client.name + " " + client.surname}</strong></Col>
                                    <Col className="mt-2">{order} Order creation: <strong>{props.order.creationdate}</strong></Col>
                                    <Col className="mt-2">{handout} Claim date: <strong>{props.order.claimdate}</strong></Col>
                                    <Col className="mt-2">{euro} Total: <strong>{totalprice()}</strong></Col>
                                    <Col><div className="d-flex justify-content-center"><ContactClient /></div></Col>
                                </Container>

                            </Accordion.Header>
                            <Accordion.Body className="p-0">
                                <Table striped className="p-0 m-0">
                                    <tbody>
                                        {orderFailed && orderFailed.products && orderFailed.products.map((p, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{ "width": "33%", "text-align": "center" }}>{p.name}</td>
                                                    <td style={{ "width": "33%", "text-align": "center" }}>{p.quantity} {p.measure}</td>
                                                    <td style={{ "width": "33%", "text-align": "center" }}>{parseFloat(p.price).toFixed(2)}€</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </ Accordion.Body>
                        </Accordion.Item >
                    </Accordion >
                    :
                    <></>
            }
        </>
    );
}