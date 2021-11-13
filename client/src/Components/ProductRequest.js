import { Card, Container, Form, Table, ListGroup, ListGroupItem, Button, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import Select from 'react-select'
import { iconAdd, iconSub, iconAddDisabled, iconSubDisabled } from "./Icons";
import dayjs from "dayjs";
import { Link } from 'react-router-dom'

function ProductLine(props) {
    const { product } = props;

    const [quantity, setQuantity] = useState(0);
    const [available, setAvailable] = useState(true)

    { (quantity != 0 && !props.productsSelected.length) && setQuantity(0) }

    const add = () => {
        let x = quantity + 1;
        handleProducts(x)
    }

    const sub = () => {
        if (quantity > 0) {
            let x = quantity - 1;
            handleProducts(x)
        }
    }

    const handleProducts = (x) => {
        setQuantity(x);

        if (x >= product.quantity) {
            setAvailable(false);
        } else {
            setAvailable(true)
        }
        if (props.productsSelected.length == 0) {
            const newProduct = { productid: product.id, name: product.name, quantity: x, measure: product.measure, price: product.price };
            props.setProductsSelected([newProduct])
        } else {
            const otherProducts = props.productsSelected.filter(p => p.productid != product.id)
            if (x == 0) {
                props.setProductsSelected(otherProducts);
            } else {
                const newProduct = { productid: product.id, name: product.name, quantity: x, measure: product.measure, price: product.price };
                const newProducts = [...otherProducts, newProduct];
                props.setProductsSelected(newProducts);
            }
        }
    }


    return (<tr>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{quantity + " " + product.measure + "/" + product.quantity + " " + product.measure + " available"}</td>
        <td>{available ? <span style={{ cursor: 'pointer' }} onClick={add}>{iconAdd}</span>
            : <span style={{ cursor: 'pointer' }}>{iconAddDisabled}</span>}&nbsp;
            {quantity != 0 ? <span style={{ cursor: 'pointer' }} onClick={sub}>{iconSub}</span>
                : <span style={{ cursor: 'pointer' }}>{iconSubDisabled}</span>}
        </td>
    </tr>
    )

}

export default function ProductRequest(props) {
    const { clients, products } = props;

    const [selectedClient, setSelectedClient] = useState("");
    const [productsSelected, setProductsSelected] = useState([]);

    const handleOrder = () => {
        const newOrder = {
            userid: selectedClient,
            creationdate: dayjs().format('YYYY-MM-DD').toString(),
            claimdate: "2021-11-10 12:30",
            confirmationdate: "2021-11-09",
            deliveryaddress: null,
            deliveryid: null,
            status: "pending",
            products: productsSelected
        }

        let valid = true;

        if (newOrder.products.length == 0) {
            valid = false;
            props.setErrorMessage("Select the amount")
            props.setShow(true);
        }

        if (valid) {
            props.setOrder(newOrder);
            setProductsSelected([])
            props.setDirty(true);
        }
    }

    return (<>
        <Container className="justify-content-center mt-3">
            <h1>Enter a new product request</h1>
            <Card className="text-left mt-4">
                <ListGroup className="list-group-flush">
                    <ListGroupItem className="p-0">
                        <Card.Header>
                            First, select <b>the client</b>.
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Select options={clients.map(client => {
                                    return {
                                        value: client.userid,
                                        label: client.name + " " + client.surname + " - " + client.address
                                    }
                                })} onChange={(event) => setSelectedClient(event.value)} />
                            </Form>
                        </Card.Body>
                    </ListGroupItem>
                </ListGroup>
            </Card>
            {selectedClient &&
                <>
                    {props.errorMessage && <Alert show={props.show} onClose={() => props.setShow(false)} variant="danger" dismissible>{props.errorMessage}</Alert>}
                    <Table className="mt-3" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Variuos info</th>
                                <th>Quantity</th>
                                <th>Add to order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.filter(p => p.quantity > 0)
                                .map(p => <ProductLine product={p} productsSelected={productsSelected} setProductsSelected={setProductsSelected}></ProductLine>)}
                        </tbody>
                    </Table>
                    <div class="d-flex justify-content-between">
                        <Link to="/"><Button variant="danger">Back</Button></Link>
                        <Button onClick={handleOrder}>Check and order</Button>
                    </div>
                </>
            }
        </Container>
    </>)
}