import { Card, Container, Form, Table, ListGroup, ListGroupItem, Button, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import Select from 'react-select'
import { iconAdd, iconSub, iconAddDisabled, iconSubDisabled } from "./Icons";
import dayjs from "dayjs";
import { Link } from 'react-router-dom'

function ProductLine(props) {
    const { product } = props;

    const [quantity, setQuantity] = useState(0);

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
        if (props.productsSelected.length == 0) {
            let total = parseFloat(product.price) * parseFloat(x);
            const newProduct = { productid: product.id, name: product.name, quantity: x, measure: product.measure, price: product.price, total: total };
            props.setProductsSelected([newProduct])
        } else {
            const otherProducts = props.productsSelected.filter(p => p.productid != product.id)
            if (x == 0) {
                props.setProductsSelected(otherProducts);
            } else {
                let total = parseFloat(product.price) * parseFloat(x);
                const newProduct = { productid: product.id, name: product.name, quantity: x, measure: product.measure, price: product.price, total: total };
                const newProducts = [...otherProducts, newProduct];
                props.setProductsSelected(newProducts);
            }
        }
    }


    return (<tr>
        <td style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}>{product.name}</td>
        <td style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}>{product.category}</td>
        <td style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}>{quantity + " " + product.measure}</td>
        <td style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}>{product.quantity + " " + product.measure + " available"}</td>
        <td style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}>{product.price}</td>
        <td>{(quantity < product.quantity) ? <span style={{ cursor: 'pointer' }} className={"add-btn-" + props.index} onClick={add}>{iconAdd}</span>
            : <span style={{ cursor: 'pointer' }}>{iconAddDisabled}</span>}&nbsp;
            {quantity != 0 ? <span style={{ cursor: 'pointer' }} className={"sub-btn-" + props.index} onClick={sub}>{iconSub}</span>
                : <span style={{ cursor: 'pointer' }}>{iconSubDisabled}</span>}
        </td>
    </tr>
    )

}

export default function ProductRequest(props) {
    const { clients, products, message } = props;
    const [selectedClient, setSelectedClient] = useState("");
    const [productsSelected, setProductsSelected] = useState([]);

    const calculateTotal = () => {
        let total = parseFloat(0)
        //old memories
        for (let i = 0; i < productsSelected.length; i++) {
            total = parseFloat(total) + parseFloat(productsSelected[i].total)
        }

        return total;
    }

    const handleOrder = (setDirty) => {
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
            props.setMessage({
                type: "error",
                show: true,
                value: "Select the amout"
            })
        }

        if (valid) {
            props.setOrder(newOrder)
            setProductsSelected([]) 
            props.setDirty(true)
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
                            <Form className="client-here">
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
                    {(products.filter(p => p.quantity > 0).length != 0) ? <>
                        {message.show && message.type === "error" && <Alert className="mt-3" show={message.show} onClose={() => props.setMessage({
                            type: message.type,
                            show: false,
                            text: message.text
                        })} variant="danger" dismissible>{message.text}</Alert>}
                        {message.show && message.type === "done" && <Alert className="mt-3" show={message.show} onClose={() => props.setMessage({
                            type: message.type,
                            show: false,
                            text: message.text
                        })} variant="success" dismissible>{message.text}</Alert>}
                        <Table className="mt-3" striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Various info</th>
                                    <th>Quantity selected</th>
                                    <th>Quantity available</th>
                                    <th>Price each</th>
                                    <th>Add to order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.filter(p => p.quantity > 0)
                                    .map(p => <ProductLine product={p} productsSelected={productsSelected} setProductsSelected={setProductsSelected}></ProductLine>)}
                            </tbody>
                        </Table>
                        {productsSelected.length > 0 && <Alert style={{ width: "100%", textAlign: "rigth" }} variant="primary">Total order: {calculateTotal()}€</Alert>}
                        <div class="d-flex justify-content-between">
                            <Link to="/"><Button className="back-btn" variant="danger">Back</Button></Link>
                            <Button onClick={() => {
                                handleOrder()
                            }}>Check and order</Button>
                        </div>
                    </>
                        :
                        <p >There are no available products</p>}
                </>
            }
        </Container>
    </>)
}