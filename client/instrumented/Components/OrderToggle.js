import { useState } from "react";
import { Accordion, Container, Table, Button, Alert } from "react-bootstrap";
import { handOutProduct } from '../API/API'

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
                <Accordion.Header >
                    <Container className="d-flex justify-content-between flex-column flex-md-row">
                        <div>Order created on the: <strong>{props.order.creationdate}</strong> </div>
                        <span><strong>Total price: {totalprice()}€</strong></span>
                    </Container>

                </Accordion.Header>
                <Accordion.Body className="p-0">
                    <Table striped >
                        <tbody>
                            {props.order.products && props.order.products.map((p, i) => {
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
                    <Container className={"d-flex " + (error ? "justify-content-between" : "justify-content-end")}>
                        {error && <Alert variant="danger" className=" mb-2 py-0 my-auto mr-2">An error has occurred: {error}</Alert>}
                        <Button variant="yellow" className="py-0 mb-2" onClick={handleConfirm}
                            disabled={props.order.status === "completed" || completed} >Confirm Handout</Button>
                    </Container>
                </ Accordion.Body>

            </Accordion.Item>
        </Accordion>
    )

}
