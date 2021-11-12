import { Card, Container, Form, Table, ListGroup, ListGroupItem, Button, Row, Col, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { addPRequest, getClients } from "../API/API"
import Select from 'react-select'
import { iconAdd, iconSub } from "./Icons";
import dayjs from "dayjs";

function ProductLine(props) {
    const {product} = props;

    const [quantity, setQuantity] = useState(0);

    const add = () => {
        let x = quantity + 1;
        setQuantity(x);
        handleProducts(x)
    }

    const sub = () => {
        if(quantity > 0){
            let x = quantity - 1;
            setQuantity(x);
            handleProducts(x)
        }
    }

    const handleProducts = (x) => {
        if (props.productsSelected.length == 0) {
            const newProduct = { productid: product.id, name: product.name, quantity: x, measure: product.measure, price: product.price };
            props.setProductsSelected([newProduct])

        }else {
            const otherProducts = props.productsSelected.filter(x => x.id != product.productid)
            const newProduct = { productid: product.id, name: product.name, quantity: x, measure: product.measure, price: product.price };
            const newProducts = [...otherProducts, newProduct];
            props.setProductsSelected(newProducts);
        }
    }


    return (<tr>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{quantity + " " + product.measure}</td>
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
                    {props.errorMessage && <Alert show={props.show} onClose={()=> props.setShow(false)} variant="danger" dismissible>Messaggio di errore da definire</Alert>}
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
                            {products.map(p => <ProductLine product={p} productsSelected={productsSelected} setProductsSelected={setProductsSelected}></ProductLine>)}
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