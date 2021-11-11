import { useEffect, useState } from "react";
import { Accordion, Container, Table, Button } from "react-bootstrap";

export default function OrderToggle(props) {

    function totalprice() {
        if (props.order.products.length > 0) {
            return parseFloat(
                props.order.products.reduce((partial_sum, product) => {
                    return (partial_sum + product.price)
                }, 0)
            ).toFixed(2)
        }
    }

    function handleConfirm(){
        //todo
    }

    return (
        <Accordion  defaultActiveKey="0" >
            <Accordion.Item key={props.chiave} className="mb-3">
                <Accordion.Header >
                    <Container className="d-flex justify-content-between">
                        <div>Order created on the: <strong>{props.order.creationdate}</strong> </div>
                        <strong>Total price: {totalprice()}€</strong>
                    </Container>

                </Accordion.Header>
                <Accordion.Body className="p-0">
                    <Table striped >
                        <tbody>
                            {props.order.products.length > 0 && props.order.products.map((p, i) => {
                                return (
                                    <tr key={i} >
                                        <td >{p.name}</td>
                                        <td>{p.quantity} {p.measure}</td>
                                        <td>{parseFloat(p.price).toFixed(2)}€</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    <Container className="d-flex justify-content-end">
                        <Button variant="outline-yellow" className="mb-2" onClick={handleConfirm}>Confirm Handout</Button>
                    </Container>
                </ Accordion.Body>

            </Accordion.Item>
        </Accordion>
    )

}
