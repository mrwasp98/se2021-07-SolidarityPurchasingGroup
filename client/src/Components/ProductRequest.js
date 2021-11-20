import { Card, Container, Form, Table, ListGroup, ListGroupItem, Button, Modal, Alert, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from 'react-select'
import { iconAdd, iconSub, iconAddDisabled, iconSubDisabled } from "./Icons";
import dayjs from "dayjs";
import { Link } from 'react-router-dom'
import { getClients } from "../API/API.js";
import HomeButton from "./HomeButton";

function ModalEnd(props) {
    return (
        <Modal show={props.showModal} handleClose={props.handleCloseModal} backdrop="static">
            <Modal.Header>
                <Modal.Title style={{ width: "100%" }}><Alert variant="success" >Order received!</Alert></Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <Form.Group controlId='selectedName'>
                        <Form.Label>Summary of order</Form.Label>
                        <ul>
                            {props.products.summary.map((x, i) => <li key={i}>{x.quantity + " " + x.measure + " of " + x.name}</li>)}
                        </ul>
                        <p>Total: {props.products.total}€</p>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        props.setShowModal(false)
                        props.setDirtyAvailability(true)
                    }}>Ok</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

function ProductLine(props) {
    const { product } = props;

    const [quantity, setQuantity] = useState(0);

    (quantity !== 0 && !props.productsSelected.length) && setQuantity(0)

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
        if (props.productsSelected.length === 0) {
            let total = parseFloat(product.price) * parseFloat(x);
            const newProduct = { productid: product.id, name: product.name, quantity: x, measure: product.measure, price: product.price, total: total };
            props.setProductsSelected([newProduct])
        } else {
            const otherProducts = props.productsSelected.filter(p => p.productid !== product.id)
            if (x === 0) {
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
        <td className="align-middle" style={quantity > 0 ? { background: "#ffdead"} : { background: "" }}>
            <Row className="align-items-center">
                <Col style={{marginLeft: "0.5rem"}}>
                    <p style={{fontSize: "18pt"}}>{product.name}</p>
                    {product.quantity + " " + product.measure + " available"}
                </Col>
                <Col style={{textAlign: "right", marginRight: "2rem"}}>Quantity: <b>{quantity + " " + product.measure}</b></Col>
            </Row>
        </td>
        <td className="align-middle" style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}><p style={{fontSize: "18pt"}}>{product.price}€</p></td>
        <td className="align-middle">{(quantity < product.quantity) ? <span style={{ cursor: 'pointer' }} className={"add-btn-" + props.index} onClick={add}>{iconAdd}</span>
            : <span style={{ cursor: 'pointer' }}>{iconAddDisabled}</span>}&nbsp;
            {quantity !== 0 ? <span style={{ cursor: 'pointer' }} className={"sub-btn-" + props.index} onClick={sub}>{iconSub}</span>
                : <span style={{ cursor: 'pointer' }}>{iconSubDisabled}</span>}
        </td>
    </tr>
    )

}

export default function ProductRequest(props) {
    const { clients, products, message } = props;
    const [selectedClient, setSelectedClient] = useState("");
    const [productsSelected, setProductsSelected] = useState([]);
    const [summary, setSummary] = useState([])
    const [product, setProduct] = useState("");

    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    //this use Effect is used to load the clients when the component is loaded
    useEffect(() => {
        if (props.dirtyClients) {
            getClients()
                .then((res) => {
                    props.setClients(res)
                    props.setDirtyClients(false);
                })
        }
    }, [props]);

    useEffect(()=>{

    }, [product])

    const calculateTotal = (elements) => {
        let total = parseFloat(0)
        //old memories
        for (let i = 0; i < elements.length; i++) {
            total = parseFloat(total) + parseFloat(elements[i].total)
        }
        return total;
    }

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

        if (newOrder.products.length === 0) {
            valid = false;
            props.setMessage({
                type: "error",
                show: true,
                text: "Select the amount of at least one product"
            })
        }

        if (valid) {
            props.setOrder(newOrder)
            setSummary(productsSelected);
            setProductsSelected([])
            props.setDirty(true)
            props.setDirtyAvailability(true)
        }
    }

    return (<>
        <Container className="containerProdRequest justify-content-center mt-3">
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
                    {(products.filter(p => p.quantity > 0).length !== 0) ? <>
                        <ModalEnd showModal={message.show && message.type === "done"} setShowModal={() => {
                            props.setMessage({
                                type: message.type,
                                show: false,
                                text: message.text
                            })
                        }} handleCloseModal={handleCloseModal} handleShowModal={handleShowModal} products={{ summary: summary, total: calculateTotal(summary) }} setDirtyAvailability={props.setDirtyAvailability} />
                        <Row>
                            <Col className="d-none d-md-block">
                            </Col>
                            <Col className="d-none d-md-block">
                            </Col>
                            <Col>
                                <Form>
                                <Form.Group className="mb-3" controlId="formProduct">
                                    <Form.Label></Form.Label>
                                        <Form.Control type="product" placeholder="Search product" onChange={(ev)=>setProduct(ev.target.value)}/>
                                </Form.Group>
                                </Form>
                            </Col>
                        </Row>
  
                        <Table className="mt-3" striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price each</th>
                                    <th>Add to order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.filter(p => p.quantity > 0)
                                    .filter(p => p.name.toLowerCase().includes(product) || p.name.toUpperCase().includes(product))
                                    .map((p, index) => <ProductLine product={p} index={index} key={index} productsSelected={productsSelected} setProductsSelected={setProductsSelected}></ProductLine>)}
                            </tbody>
                        </Table>
                        {message.show && message.type === "error" && <Alert className="mt-3" show={message.show} onClose={() => props.setMessage({
                            type: message.type,
                            show: false,
                            text: message.text
                        })} variant="danger" dismissible>{message.text}</Alert>}
                        {productsSelected.length > 0 && <Alert style={{ width: "100%", textAlign: "rigth" }} variant="primary">Total order: {calculateTotal(productsSelected)}€</Alert>}
                        <div className="d-flex justify-content-between mb-4">
                            <Link to="/"><Button variant="danger" className="back-btn">Back</Button></Link>
                            <Button className="order-btn" variant="yellow" onClick={() => handleOrder()}>Check and order</Button>
                        </div>
                    </>
                        :
                        <Alert className="mt-3" variant="primary">There are no available products</Alert>}
                </>
            }
            <HomeButton/>
        </Container>
    </>)
}