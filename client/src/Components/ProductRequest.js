import { Card, Container, Form, Table, ListGroup, ListGroupItem, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { addPRequest, getClients } from "../API/API"
import Select from 'react-select'
import { iconAdd, iconSub } from "./Icons";
import dayjs from "dayjs";

function ProductLine(props) {
    //const {..., ...} = props;

    const [quantity, setQuantity] = useState(0);

    const add = () => {
        let x = quantity + 1;
        setQuantity(x);
        handleOrder()
    }

    const sub = () => {
        let x = quantity - 1;
        setQuantity(x);
        handleOrder()
    }

    const handleOrder = () => {
        if (props.productsSelected.length == 0) {
            const newProduct = { productid: props.product.id, name: props.product.name, quantity: quantity, measure: props.product.measure, price: props.product.price };
            props.setProductsSelected([newProduct])

        }
        else {
            const otherProducts = props.productsSelected.filter(x => x.id != props.product.id)
            const newProduct = { productid: props.product.id, name: props.product.name, quantity: quantity, measure: props.product.measure, price: props.product.price };
            const newProducts = [...otherProducts, newProduct];
            props.setProductsSelected(newProducts);
        }
    }


    return (<tr>
        <td>{props.product.name}</td>
        <td>{props.product.category}</td>
        <td>{quantity}</td>
        <td><span style={{ cursor: 'pointer' }} onClick={add}>{iconAdd}</span>&nbsp;
            <span style={{ cursor: 'pointer' }} onClick={sub}>{iconSub}</span>&nbsp;</td>
    </tr>
    )

}

export default function ProductRequest(props) {

    const { clients } = props;

    //clients { value: e.userid, label: e.name + " " + e.surname + " - " + e.address }

    const [selectedClient, setSelectedClient] = useState("");
    const [products, setProducts] = useState(props.products);
    const [productsSelected, setProductsSelected] = useState([]);


    console.log();

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
        console.log(newOrder)
        props.setOrder(newOrder);
        props.setDirty(true);
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
                            {props.products.map(p => <ProductLine product={p} productsSelected={productsSelected} setProductsSelected={setProductsSelected}></ProductLine>)}
                        </tbody>
                    </Table>
                    <div class="d-flex justify-content-between">
                        <Button variant="danger">Back</Button>
                        <Button onClick={handleOrder}>Check and order</Button>
                    </div>
                </>
            }
        </Container>
    </>)
}