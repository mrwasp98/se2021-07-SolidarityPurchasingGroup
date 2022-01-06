import { Container, Table, ListGroup, Tab, Row, Col, Form, Button, Image, Modal, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import { iconAdd, iconSub, iconAddDisabled, iconSubDisabled, trash, edit, reportAvailabilitiesBIG, reportAvailabilitiesSMALL, basket2, box } from "./Utilities/Icons";
import HomeButton from './Utilities/HomeButton'
import "../App.css";
import dayjs from 'dayjs';
import { getFarmersOrders, updateOrderStatus, insertAvailability, getProductsByFarmer, deleteProduct } from "../API/API.js";
import axios from 'axios';

function ProductAction(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (<>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title style={{ width: "100%" }}><Alert variant="danger">Deleting... </Alert></Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure to delete <b>{props.name}</b> from your products?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" id="modal_back" onClick={handleClose}>
                    Back
                </Button>
                <Button variant="primary" id="modal_delete" onClick={() => {
                    handleClose()
                    props.deleteProd(props.id, props.picture)
                }}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
        <Link to={{
            pathname: "/editProduct",
            state: { id: props.id, name: props.name, description: props.description, farmerid: props.farmerid, category: props.category, typeofproduction: props.typeofproduction, measure: props.measure, picture: props.picture }
        }}><Button className="p-0" id={`productavailability_edit_${props.index}`}>{edit}</Button>
        </Link>&nbsp;
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
        <td><Image style={{ width: "200px" }} src={product.picture} fluid /></td>
        <td><ProductAction index={props.index} id={product.id} name={product.name} description={product.description} farmerid={props.farmerid} category={product.category} typeofproduction={product.typeofproduction} measure={product.measure} picture={product.picture} deleteProd={props.deleteProd}></ProductAction></td>
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
            const newProduct = { productid: product.id, dateavailability: props.dateavailability, quantity: newQuantity, status: 'pending', price: newPrice };
            props.setProductsAvailable([newProduct])
        } else {
            const otherProducts = props.productsAvailable.filter(p => p.productid !== product.id)
            if (newQuantity === 0) {
                props.setProductsAvailable(otherProducts);
            } else {
                const newProduct = { productid: product.id, dateavailability: props.dateavailability, quantity: newQuantity, status: 'pending', price: newPrice };
                const newProducts = [...otherProducts, newProduct];
                props.setProductsAvailable(newProducts);
            }
        }
    }

    return (<tr className="align-middle">
        <td style={{ fontSize: "17px" }}>{product.name}</td>
        <td>
            <Form.Group controlId="formBasicPrice" >
                {"€ "}
                <input
                    className="align-baseline inputFarmerTable"
                    type="number"
                    min={1}
                    id="test"
                    max={1000}
                    step={0.1}
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    style={{ width: "80%" }}
                />
            </Form.Group>
        </td>
        <td> <Row className="justify-content-center"><Image style={{ width: "130px" }} src={product.picture} fluid /></Row></td>
        <td>
            <Row className="justify-content-center">
                {quantity > 0 ? <Col style={{ cursor: 'pointer' }} className={"text-center sub-btn-" + props.index} onClick={sub}>{iconSub}</Col>
                    : <Col className="text-center" style={{ cursor: 'pointer' }}>{iconSubDisabled}</Col>}
                <Col>{quantity + " " + product.measure + " "}</Col>
                {(quantity > -1) ? <Col style={{ cursor: 'pointer' }} className={"text-center add-btn-" + props.index} onClick={add}>{iconAdd}</Col>
                    : <Col style={{ cursor: 'pointer' }} className="text-center">{iconAddDisabled}</Col>}&nbsp;
            </Row>
        </td>
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
    const [product, setProduct] = useState("");

    const [orders, setOrders] = useState([]);
    const [dateavailability, setDateavailability] = useState(dayjs(props.date).add(1, 'day').format('YYYY-MM-DD'))
    const [productsAvailable, setProductsAvailable] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [dirtyO, setDirtyO] = useState(false);

    /** This function sets the date of availability 
     * if today is saturday or sunday the date of availability is monday by 9
     * if today is monday the date of availability is today by 9
     * 
     */
    const getMondayOfTheWeek = () => {
        var today = props.date;
        switch (today.getDay()) {
            case 0: //domenica
                setDateavailability(dayjs(props.date).add(1, 'day').format('YYYY-MM-DD'))
                break;
            case 1: //lunedi
                //if the farm sets the availability before 9 am the date of availability is this monday
                if (dayjs(props.date).hour() < 9) {
                    setDateavailability(dayjs(props.date).format('YYYY-MM-DD'))
                } else { //if the farm sets the availability after 9 am the date of availability is this next monday
                    setDateavailability(dayjs(props.date).add(7, 'day').format('YYYY-MM-DD'))
                }
                break;
            case 6: //sabato
                setDateavailability(dayjs(props.date).subtract(1, 'day').format('YYYY-MM-DD'))
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (showAlert === true) {
            setTimeout(() => {
                setShowAlert(false);
            }, 1500);
        }
    }, [showAlert]);

    // this useEffect gets all the product of a particular farmer
    useEffect(() => {
        if (dirty) {
            getMondayOfTheWeek()
            getProductsByFarmer(props.userId)
                .then(res => {
                    setProducts(res)
                })
                .then(() => setDirty(false))
                .catch(err => console.log(err))
        }
        // eslint-disable-next-line
    }, [dirty, props.userId]);

    useEffect(() => {
        getFarmersOrders(props.userId, props.date, 'null')
            .then((orders) => {
                setOrders(orders);
            })
            .catch(err => { console.log(err) })
        if (dirtyO) {
            setDirtyO(false);
        }
    }, [dirtyO, props.date, props.userId]);

    const deleteImage = async (picture) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const url = 'http://localhost:3001/api'
        axios.delete(url + picture, config).then().catch(err => { console.log(err) })
    }


    const deleteProd = (productid, picture) => {
        //FIRST, delete the image
        deleteImage(picture)
        //THEN, delete the product
        deleteProduct(productid).then((res) => {
            setDirty(true)
        }).catch((err) => console.log(err));
    }

    const handleReport = () => {
        productsAvailable.map(async p => await insertAvailability(p))
        if (props.telegramStarted === true) {
            props.chatIds.forEach(chatId =>
                props.bot.sendMessage(chatId, "Il farmer " + props.username + " ha pubblicato nuovi prodotti!")
            )
        }
        setShowAlert(true);
        setDirty(true)
    }

    return (<Container className="justify-content-center pt-4">
        <h1>Hello <i>{props.username}</i>!</h1>
        <hr></hr>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            {showAlert ?
                <Alert variant="success" className="m-0"
                    style={{ position: "fixed", width: "90%", top: '3rem', zIndex: '200', background: '#14B8B8', color: "white" }}>Report sent successfully!</Alert>
                :
                <></>
            }
            <Row>
                <Col sm={3} style={{ backgroundColor: '#f2f2f2' }}>
                    <ListGroup variant="flush" className="mt-3">
                        <ListGroup.Item action href="#link1" id="link1">
                            <span classname="pb-1">{basket2} </span>

                            Your products
                        </ListGroup.Item>
                        <ListGroup.Item action href="#link2" id="link2">
                            <span classname="pb-1">{reportAvailabilitiesSMALL} </span>
                            Report product availability
                        </ListGroup.Item>
                        {(dayjs(props.date).format('dddd') !== 'Sunday' && dayjs(props.date).format('dddd') !== 'Saturday' && dayjs(props.date).format('dddd HH') !== 'Friday 20' && dayjs(props.date).format('dddd HH') !== 'Friday 21' && dayjs(props.date).format('dddd HH') !== 'Friday 22' && dayjs(props.date).format('dddd HH') !== 'Friday 23') ?
                            <ListGroup.Item action href="#link3" id="link3">
                                <span classname="pb-1">{box} </span>
                                Confirm preparation
                            </ListGroup.Item>
                            :
                            <></>
                        }
                    </ListGroup>
                </Col>
                <Col sm={9} className="p-0 m-0">
                    <Tab.Content>
                        <Tab.Pane eventKey="#link1">
                            <Col>
                                <h3>These are all your products</h3>
                            </Col>
                            <Row className="p-1">
                                <Col className="d-flex justify-content-start align-items-center">
                                    <Form>
                                        <Form.Group controlId="formProduct">
                                            <Form.Label></Form.Label>
                                            <Form.Control type="product" placeholder="Search product" onChange={(ev) => setProduct(ev.target.value)} />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col className="d-flex justify-content-end align-items-end">
                                    <Link to={{ pathname: "/addProduct" }}><Button id="farmer_add_product">Add product</Button></Link>
                                </Col>
                            </Row>
                            <Row>
                                <Table className="mt-4 tabFarmer" striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Image</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.filter(p => p.name.toLowerCase().includes(product) || p.name.toUpperCase().includes(product)).map((product, index) => <ProductRow key={product.id} index={index} farmerid={props.userId} product={product} deleteProd={deleteProd}></ProductRow>)}
                                    </tbody>
                                </Table>
                            </Row>
                        </Tab.Pane>
                        {!((props.date.getDay() === 6 && dayjs(props.date).hour() >= 9) || props.date.getDay() === 0 || (props.date.getDay() === 1 && dayjs(props.date).hour() < 9)) ? <>
                            <Tab.Pane eventKey="#link2" className="p-4">
                                <h3>Report the availability for the next week</h3>
                                <span className='text-muted'>Select the quantities you expect to deliver for next week. When you're done, click on the light blue button.</span>
                                <Table className="mt-3 " striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Image</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) =>
                                            <ProductAvailableRow key={product.id} index={index} product={product} dateavailability={dateavailability} productsAvailable={productsAvailable} setProductsAvailable={setProductsAvailable}></ProductAvailableRow>)}
                                    </tbody>
                                </Table>

                                <Button className="order-btn position-fixed d-none d-md-block mx-auto rounded-circle pt-2" variant="yellow" onClick={() => handleReport()}
                                    style={{ width: '4rem', height: '4rem', bottom: '3rem', zIndex: '100', right: '8rem' }}>
                                    {reportAvailabilitiesBIG}
                                </Button>
                            </Tab.Pane>
                        </>
                            :
                            <>
                                <Tab.Pane eventKey="#link2">
                                    <Alert style={{ fontSize: "18pt" }}>You can do the estimation by monday at 9:00 am</Alert>
                                </Tab.Pane>
                            </>}
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
    </Container>
    )
}