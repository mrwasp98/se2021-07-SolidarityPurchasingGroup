import { Container, Table, ListGroup, Tab, Row, Col, Form, Button, Image, Modal, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect, useState } from "react";
import { iconAdd, iconSub, iconAddDisabled, iconSubDisabled, trash, edit, reportAvailabilitiesBIG, reportAvailabilitiesSMALL, basket2, bagcheckBIG, bagcheckSMALL } from "./Utilities/Icons";
import HomeButton from './Utilities/HomeButton'
import "../App.css";
import dayjs from 'dayjs';
import { getProductAvailability, insertAvailability, getProductsByFarmer, deleteProduct, confirmAvailabilities } from "../API/API.js";
import axios from 'axios';

/*const expectedavailabilities = [
    {
        productid: "1",
        productName: "Product 1",
        dateavailability: "00/00/0000",
        quantity: 3.0,
        measure: "l",
        status: "pending",
        price: 12.00
    }, {
        productid: "2",
        productName: "Product 2",
        dateavailability: "00/00/0000",
        quantity: 4.0,
        measure: "kg",
        status: "pending",
        price: 1.00
    }, {
        productid: "3",
        productName: "Product 3",
        dateavailability: "00/00/0000",
        quantity: 1.0,
        measure: "kg",
        status: "pending",
        price: 10.00
    }, {
        productid: "4",
        productName: "Product 4",
        dateavailability: "00/00/0000",
        quantity: 6.5,
        measure: "units",
        status: "pending",
        price: 16.12
    }
]*/

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

/*function OrderAction(props) {
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
}*/

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
        let x = quantity + 0.5;
        handleProductsAvailable(x, price)
    }

    const sub = () => {
        if (quantity > 0) {
            let x = quantity - 0.5;
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
    const { availability, setConfirmedAvailabilities } = props;
    const [checked, setChecked] = useState(false)

    const handleCheck = () => {
        setChecked(old => !old);
        setConfirmedAvailabilities(old => {
            let x = old.map(e => {
                if (e.productid === availability.productid) {
                    return { ...e, status: !checked }
                } else return e
            })
            console.log(x)
            return x
        })
    }

    return (<tr>
        <td>{availability.productName}</td>
        <td>{availability.price} €</td>
        <td>{parseFloat(availability.quantity).toFixed(2)} {availability.measure}</td>
        <td>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label={checked ? "Available!" : "Not available!"} checked={checked} onChange={() => { handleCheck() }} />
            </Form.Group>
        </td>
    </tr>
    )
}

export default function ReportAvailability(props) {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState("");

    const [pendingAvailabilities, setPendingAvailabilities] = useState([]); //those are the expected availabilities that can be confirmed
    const [confirmedAvailabilities, setConfirmedAvailabilities] = useState([]) //saves the status of the availabilites that are about to be confirmed

    const [dateavailability, setDateavailability] = useState(dayjs(props.date).add(1, 'day').format('YYYY-MM-DD'))
    const [productsAvailable, setProductsAvailable] = useState([]);
    const [dirty, setDirty] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

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


    //this useEffect is used to align props.data to dateavailability
    useEffect(() => {
        setDateavailability(dayjs(props.date).add(1, 'day').format('YYYY-MM-DD'))
    }, [props.date])

    //use effect used to load the expected availabilities that can be confirmed
    useEffect(() => {
        async function f() {
            const expected = await getProductAvailability(props.userId, props.date);
            setPendingAvailabilities(expected);
            setConfirmedAvailabilities(expected.map(el => {
                return { productid: el.productid, dateavailability: el.dateavailability, status: false }
            }))
        }
        f();
    }, [props.date, props.userId]);

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
        console.log("products available ", productsAvailable)
        productsAvailable.map(async p => await insertAvailability(p))
        if (props.telegramStarted === true) {
            props.chatIds.forEach(chatId =>
                props.bot.sendMessage(chatId, "Il farmer " + props.username + " ha pubblicato nuovi prodotti!")
            )
        }
        setShowAlert("Report sent successfully!");
        setDirty(true)
        setProductsAvailable([])
    }

    const handleAvailabilities = () => {
        confirmAvailabilities(confirmedAvailabilities)
            .then(() => {
                setShowAlert("Availabilities have been correctly confirmed.")
            }).catch((err) => {
                setShowErrorAlert(err.message);
            })
    }

    return (<Container className="justify-content-center pt-4">
        <h1>Hello <i>{props.username}</i>!</h1>
        <hr></hr>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
            {showAlert &&
                <Alert variant="success" className="m-0" dismissible onClose={() => setShowAlert("")}
                    style={{ position: "fixed", width: "90%", top: '3rem', zIndex: '200', background: '#14B8B8', color: "white" }}>{showAlert}</Alert>
            }
            {showErrorAlert &&
                <Alert variant="danger" className="m-0" dismissible onClose={() => setShowErrorAlert("")}
                    style={{ position: "fixed", width: "90%", top: '3rem', zIndex: '200' }}>An error occurred: {showErrorAlert}</Alert>
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
                        <ListGroup.Item action href="#link3" id="link3">
                            <span classname="pb-1">{bagcheckSMALL} </span>
                            Confirm availability
                        </ListGroup.Item>
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
                        {
                            //By Saturday morning at 9 am farmers provide estimates of available products (with prices and quantities)
                            ((props.date.getDay() === 6 && dayjs(props.date).hour() < 9) || ((props.date.getDay() === 1 && dayjs(props.date).hour() > 9) || (props.date.getDay() > 1 && props.date.getDay() < 6)))
                                ? <>
                                    <Tab.Pane eventKey="#link2" className="p-4 pt-0">
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
                                    <Tab.Pane eventKey="#link2" className="p-4 pt-0">
                                        <Alert style={{ fontSize: "18pt" }}>You can report the expected products only between Monday after 9:00 AM and Saturday before 9:00 AM</Alert>
                                    </Tab.Pane>
                                </>
                        }
                        {
                            //On Monday by 9:00 am the Farmers confirm available products
                            !((props.date.getDay() === 6 && dayjs(props.date).hour() < 9) || ((props.date.getDay() === 1 && dayjs(props.date).hour() > 9) || (props.date.getDay() > 1 && props.date.getDay() < 6)))
                                ?
                                <Tab.Pane eventKey="#link3" className="p-4 pt-0">
                                    <h3>Confirm reported availabilities</h3>
                                    <span className='text-muted'>You can give confirmation on your expected availabilities for next week. <br /> <strong>Take notice that the confirmation can only be done once!</strong></span>
                                    <Table className="mt-3" striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Select</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingAvailabilities.map(availability => <ConfirmRow availability={availability} setConfirmedAvailabilities={setConfirmedAvailabilities} />)}
                                        </tbody>
                                    </Table>
                                    <Button className="order-btn position-fixed d-none d-md-block mx-auto rounded-circle pt-2" variant="yellow" onClick={() => handleAvailabilities()}
                                        style={{ width: '4rem', height: '4rem', bottom: '3rem', zIndex: '100', right: '8rem' }}>
                                        {bagcheckBIG}
                                    </Button>
                                </Tab.Pane>
                                :
                                <Tab.Pane eventKey="#link3" className="p-4 pt-0">
                                    <Alert style={{ fontSize: "18pt" }}>You can confirm the declared availabilities only between Saturday after 9:00 AM and Monday before 9:00 AM</Alert>
                                </Tab.Pane>
                        }
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        <HomeButton logged={props.logged} />
    </Container>
    )
}