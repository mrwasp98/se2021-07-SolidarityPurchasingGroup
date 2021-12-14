import {Container, Table, ListGroup, Tab, Row, Col, Form, Button, Image, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { useEffect, useState} from "react";
import { iconAdd, iconSub, iconAddDisabled, iconSubDisabled, trash, edit} from "./Icons";
import HomeButton from './HomeButton'
import "../App.css";
import dayjs from 'dayjs';
import { getFarmersOrders, updateOrderStatus, insertAvailability, getProductsByFarmer, deleteProduct } from "../API/API.js";
import axios from 'axios';

function ProductAction(props){

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    return (<>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Deleting...</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to delete <b>{props.name}</b> from your products?</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" id="modal_back" onClick={handleClose}>
                Back
            </Button>
            <Button variant="primary" id="modal_delete" onClick={() => props.deleteProd(props.id, props.picture)}>
                Delete
            </Button>
            </Modal.Footer>
        </Modal>
            <span to={{
                        pathname: "/editProduct",
                        state: { id: props.id, name: props.name, description: props.description, category: props.category, typeofproduction: props.typeofproduction, measure: props.measure, picture: props.picture}
                    }}><Button className="p-0" id={`productavailability_edit_${props.index}`}>{edit}</Button>
            </span>&nbsp; 
            <span onClick={handleShow}><Button className="p-0" id={`productavailability_delete_${props.index}`}>{trash}</Button></span>
        </>
    )
}

function OrderAction(props) {
    const action = () => {
        updateOrderStatus(props.orderid, props.productid, "packaged").then(() => {
            props.setDirtyO(true)
        })
            .catch(err => console.log(err));
    };
    return (<>
        <Button onClick={action}>Confirm</Button>
    </>
    )
}

function ProductRow(props) {
    const { product } = props;

    return (<tr>
        <td>{product.name}</td>
        <td>{product.description}</td>
        <td><Image style={{ width: "100px" }} src={product.picture} fluid /></td>
        <td><ProductAction index={props.index} id={product.id} name={product.name} description={product.description} category={product.category} typeofproduction={product.typeofproduction} measure={product.measure} picture={product.picture} deleteProd={props.deleteProd}></ProductAction></td>
    </tr>
    )
}

function ProductAvailableRow(props) {
    const { product } = props;
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const add = () => {
        let x = quantity + 1;
        handleProductsAvailable(x, price)
    }

    const sub = () => {
        if (quantity > 0) {
            let x = quantity - 1;
            handleProductsAvailable(x, price)
        }
    }

    const handleProductsAvailable = (newQuantity, newPrice) => {
        setPrice(newPrice);
        setQuantity(newQuantity);
        if (props.productsAvailable.length === 0) {
            const newProduct = { productid: product.id, dateavailability: '13-12-2021', quantity: newQuantity, status: 'ok', price: newPrice };
            props.setProductsAvailable([newProduct])
        } else {
            const otherProducts = props.productsAvailable.filter(p => p.productid !== product.id)
            if (newQuantity === 0) {
                props.setProductsAvailable(otherProducts);
            } else {
                const newProduct = { productid: product.id, dateavailability: '13-12-2021', quantity: newQuantity, status: 'ok', price: newPrice };
                const newProducts = [...otherProducts, newProduct];
                props.setProductsAvailable(newProducts);
            }
        }
    }

    return (<tr>
        <td style={{ fontSize: "18pt" }}>{product.name}</td>
        <td>
            <Form.Group controlId="formBasicPrice" >
                {"€ "}
                <input
                className="align-baseline"
                    type="number"
                    min={1}
                    max={1000}
                    step={0.01}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
            </Form.Group>
        </td>
        <td><Image style={{ width: "100px" }} src={product.picture} fluid /></td>
        <td className="align-middle">{(quantity > -1) ? <span style={{ cursor: 'pointer' }} className={"add-btn-" + props.index} onClick={add}>{iconAdd}</span>
            : <span style={{ cursor: 'pointer' }}>{iconAddDisabled}</span>}&nbsp;
            {quantity > 0 ? <span style={{ cursor: 'pointer' }} className={"sub-btn-" + props.index} onClick={sub}>{iconSub}</span>
                : <span style={{ cursor: 'pointer' }}>{iconSubDisabled}</span>}
        </td>
        <td>{quantity + " " + product.measure}</td>
    </tr>
    )
}

function ConfirmRow(props) {
    const { order } = props;

    return (<tr>
        <td>{order.name}</td>
        <td>{order.quantity}</td>
        <td>{order.measure}</td>
        <td>{order.price}</td>
        <td><OrderAction orderid={order.orderid} productid={order.productid} setDirtyO={props.setDirtyO} /></td>
    </tr>
    )
}

export default function ReportAvailability(props) {
    const [products, setProducts] = useState([]);

    const [orders, setOrders] = useState([]);

    const [productsAvailable, setProductsAvailable] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [dirtyO, setDirtyO] = useState(false);


    // this useEffect gets all the product of a particular farmer
    useEffect(() => {
        if (dirty) {
            getProductsByFarmer(1)
                .then(res => {
                    console.log(res)
                    setProducts(res)
                })
                .then(() => setDirty(false))
                .catch(err => console.log(err))
        }
    }, [dirty]);

    useEffect(() => {
        getFarmersOrders(props.userId, props.date, 'null')
        .then((orders) => {
            setOrders(orders);
        })
        .catch(err=>{console.log(err)})
        if (dirtyO) {
            setDirtyO(false);
        }
    }, [dirtyO, props.date]);

    const deleteImage = async (picture) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const url = 'http://localhost:3001/api'
        axios.delete(url+picture, config).then().catch(err => {})
      }


    const deleteProd = (productid, picture) => {
        //FIRST, delete the image
        deleteImage(picture)
        deleteProduct(productid).then(() => setDirty(true));
      }
        
    const handleReport = () => {
        productsAvailable.forEach(async p => await insertAvailability(p));
    }

    return (<Container className="justify-content-center">
        <h1>Hello {props.username}!</h1>
        <hr></hr>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            <Row>
                <Col sm={3} style={{ backgroundColor: '#f2f2f2' }}>
                    <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item action href="#link1" id="link1">
                            Your products
                        </ListGroup.Item>
                        <ListGroup.Item action href="#link2" id="link2">
                            Expected availability
                        </ListGroup.Item>
                        {(dayjs(props.date).format('dddd') !== 'Sunday' && dayjs(props.date).format('dddd') !== 'Saturday' && dayjs(props.date).format('dddd HH') !== 'Friday 20' && dayjs(props.date).format('dddd HH') !== 'Friday 21' && dayjs(props.date).format('dddd HH') !== 'Friday 22' && dayjs(props.date).format('dddd HH') !== 'Friday 23') ?
                            <ListGroup.Item action href="#link3"  id="link3">
                                Confirm preparation
                            </ListGroup.Item>
                            :
                            <></>
                        }
                    </ListGroup>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="#link1">
                            <Row >
                                <Col>
                                    <h3>These are all your products</h3>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Link to={{ pathname: "/addProduct" }}><Button id="farmer_add_product">Add product</Button></Link>
                                </Col>
                            </Row>
                            <Table className="mt-4" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => <ProductRow key={product.id} index={index} product={product} deleteProd={deleteProd}></ProductRow>)}
                                </tbody>
                            </Table>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#link2">
                            <h3>Select the availability for the next week</h3>
                            <Table className="mt-3" striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Image</th>
                                        <th>Quantity</th>
                                        <th>Available</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => <ProductAvailableRow key={product.id} index={index} product={product} productsAvailable={productsAvailable} setProductsAvailable={setProductsAvailable}></ProductAvailableRow>)}
                                </tbody>
                            </Table>
                            <div className="d-flex justify-content-center mb-4">
                                <Button className="order-btn" variant="yellow" onClick={() => handleReport()}>Send report</Button>
                            </div>
                        </Tab.Pane>
                        {(dayjs(props.date).format('dddd') !== 'Sunday' && dayjs(props.date).format('dddd') !== 'Saturday' && dayjs(props.date).format('dddd HH') !== 'Friday 20' && dayjs(props.date).format('dddd HH') !== 'Friday 21' && dayjs(props.date).format('dddd HH') !== 'Friday 22' && dayjs(props.date).format('dddd HH') !== 'Friday 23') ?
                            <Tab.Pane eventKey="#link3">
                                <h3>Confirm the preparation of a booked orders</h3>
                                <Table className="mt-3" striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Measure</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => <ConfirmRow order={order} setDirtyO={setDirtyO} />)}
                                    </tbody>
                                </Table>
                            </Tab.Pane>
                            :
                            <></>
                        }
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        <HomeButton logged={props.logged} />
    </Container>)
}