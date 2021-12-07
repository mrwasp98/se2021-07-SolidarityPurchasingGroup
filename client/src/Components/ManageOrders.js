import { useEffect, useState } from "react";
import { Card, ListGroup, ListGroupItem, Col, Table, Accordion, Container } from "react-bootstrap";
import React from 'react'
import Select from 'react-select'
import { getOrdersByStatus } from "../API/API"
import HomeButton from "./HomeButton";
// import ContactClient from "./ContactClient";
import { fail, order } from "./Icons";

export default function ManageOrders(props) {
    const [oldLength, setOldLength] = useState(0); //metodo che fa acqua, da aggiornare quando gli ordini canceled possono essere rimossi
    useEffect(() => {
        if (oldLength == 0 || props.failedOrders.length != oldLength) {
            getOrdersByStatus("pending") //da cambiare in ....
                .then((orders) => {
                    props.setFailedOrders(orders);
                    setOldLength(orders.length);
                    console.log(orders);
                }); //deve essere cambiato nella giusta dicitura , es "canceled"
        }
    }, [props.failedOrders]);

    return (
        <>
            <Card className="text-left m-4">
                <ListGroup className="list-group-flush">
                    <ListGroupItem className="p-0">
                        <Card.Header className="alertHeader">
                            {fail} The following orders have failed
                        </Card.Header>
                        <Card.Body>
                            <ListGroup className="m-3 mt-1 mb-2">
                                {props.failedOrders.map((forder, id) => {
                                    return (
                                        <FailedOrder order={forder} />
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

    function totalprice() {
        if (props.order.products && props.order.products.length > 0) {
            return parseFloat(
                props.order.products.reduce((partial_sum, product) => {
                    return partial_sum + parseFloat(product.price)
                }, 0)).toFixed(2)
        }
    }

    return (
        <Accordion defaultActiveKey="0" className="alertAccHeader">
            <Accordion.Item key={props.chiave} className="mb-3">
                <Accordion.Header className="alertAccHeader">
                    <Container className="d-flex justify-content-between flex-column flex-md-row">
                        <Col>{order} Order created on the: <strong>{props.order.creationdate}</strong></Col>
                        <Col>{order} Order expiration on the: <strong>{props.order.creationdate}</strong></Col>
                        <Col><div className="d-flex justify-content-center"><strong>Total price: {totalprice()}€</strong></div></Col>
                        {/* <Col><ContactClient /> </Col> */}
                    </Container>

                </Accordion.Header>
                <Accordion.Body className="p-0">
                    <Table striped >
                        <tbody>
                            {props.order.products && props.order.products.map((p, i) => {
                                return (
                                    <tr key={i} >
                                        <td style={{ "width": "33%", "text-align": "center" }}>{p.name}</td>
                                        <td style={{ "width": "33%", "text-align": "center" }}>{p.quantity} {p.measure}</td>
                                        <td style={{ "width": "33%", "text-align": "center" }}>{parseFloat(p.price).toFixed(2)}€</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </ Accordion.Body>

            </Accordion.Item>
        </Accordion>
    );
}