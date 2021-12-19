import { useState } from "react";
import { Accordion, Container, Table, Button, Alert, Badge, Col } from "react-bootstrap";
import { handOutProduct } from '../../API/API'
import { handout, order } from '../Utilities/Icons'

export default function OrderToggle(props) {

    const [completed, setCompleted] = useState();
    const [error, setError] = useState("");

    //this function is called in order to calculate the total price of an order.
    function totalprice() {
        if (props.order.products && props.order.products.length > 0) {
            return parseFloat(
                props.order.products.reduce((partial_sum, product) => {
                    return partial_sum + parseFloat(product.price)
                }, 0)).toFixed(2)
        }
    }

    //this function is called when the button "confirm handout is pressed"
    async function handleConfirm() {
        setError("");
        let res = await handOutProduct(props.chiave)
        if (res.message) {
            setError(res.message)
        } else {
            setCompleted(true);
        }
    }

    return (
        <Accordion defaultActiveKey="0" >
            <Accordion.Item key={props.chiave} className="mb-3">
                <Accordion.Header className="accHeader">
                    <Container className="d-flex justify-content-between flex-column flex-md-row">
                        <Col>{order} Order created on the: <strong>{props.order.creationdate}</strong></Col>
                        {(props.order.status === "completed" || completed) ?
                            <Col><div className="d-flex justify-content-center"><Badge pill className="completed-pill">completed</Badge></div></Col>
                            :
                            <Col><div className="d-flex justify-content-center"><Badge pill className="pending-pill">pending</Badge></div></Col>
                        }
                        <Col><div className="d-flex justify-content-center"><strong>Total price: {totalprice()}€</strong></div></Col>
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
                    <Container className={"d-flex " + (error ? "justify-content-between" : "justify-content-end")}>
                        {error && <Alert variant="danger" className=" mb-2 py-0 my-auto mr-2">An error has occurred: {error}</Alert>}
                        {(props.order.status === "completed" || completed) ?
                            ""
                            :
                            <Button variant="yellow" className="py-0 mb-2" onClick={handleConfirm}>Confirm Handout {handout}</Button>
                        }
                    </Container>
                </ Accordion.Body>

            </Accordion.Item>
        </Accordion>
    )

}
