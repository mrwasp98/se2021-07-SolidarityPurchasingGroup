import { Card, Container, Form, Table, ListGroup, ListGroupItem, Button, Alert, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Select from 'react-select'
import { reportAvailabilitiesBIG, reportAvailabilitiesSMALL, iconAdd, iconSub, iconAddDisabled, iconSubDisabled, basket } from "./Utilities/Icons";
import dayjs from "dayjs";
import { getClients, getAvailableProducts, addPRequest } from "../API/API.js";
import HomeButton from "./Utilities/HomeButton";
import ModalEnd from "./Utilities/ModalEnd"
import ModalClaimDate from "./Utilities/ModalClaimDate"

function ProductLine(props) {
    const { product } = props;

    const [quantity, setQuantity] = useState(0);

    (quantity !== 0 && !props.productsSelected.length) && setQuantity(0)

    const add = () => {
        let x = quantity + 0.5;
        handleProducts(x)
    }

    const sub = () => {
        if (quantity > 0) {
            let x = quantity - 0.5;
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
        <td className="align-middle" style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}>
            <Row className="align-items-center">
                <Col style={{ marginLeft: "0.5rem" }}>
                    <p style={{ fontSize: "19px", margin: "0px" }}>{product.name}</p>
                    <p className="text-muted" style={{ fontSize: "14px" }}>{product.quantity + " " + product.measure + " available"}</p>
                </Col>
                <Col className="d-none d-md-block colBasket">{basket}: <b>{quantity + " " + product.measure}</b></Col>
            </Row>
        </td>
        <td className="align-middle" style={quantity > 0 ? { background: "#ffdead" } : { background: "" }}><p style={{ fontSize: "18px" }}>{parseFloat(product.price).toFixed(2)}€</p></td>
        <td className="align-middle">
            {(quantity < product.quantity) ? <span style={{ cursor: 'pointer' }} className={"add-btn-" + props.index} onClick={add}>{iconAdd}</span>
                : <span style={{ cursor: 'pointer' }}>{iconAddDisabled}</span>}&nbsp;
            {quantity !== 0 ? <span style={{ cursor: 'pointer' }} className={"sub-btn-" + props.index} onClick={sub}>{iconSub}</span>
                : <span style={{ cursor: 'pointer' }}>{iconSubDisabled}</span>}
        </td>
    </tr>
    )

}

export default function ProductRequest(props) {
    const { clients, products } = props;
    const [selectedClient, setSelectedClient] = useState("");
    const [productsSelected, setProductsSelected] = useState([]);
    const [summary, setSummary] = useState([])
    const [product, setProduct] = useState("");
    const [lastDate, setLastDate] = useState(dayjs(props.date)); //everytime the date changes, the product must be loaded again
    const [flag, setFlag] = useState(true)
    const [claimdate, setClaimdate] = useState(new Date());
    const [deliveryAddress, setDeliveryAddress] = useState(() => { return props.clientAddress });
    const [showAlert, setShowAlert] = useState(true);

    const [messageProductRequest, setMessageProductRequest] = useState({
        type: "",
        show: false,
        text: ""
    })
    // eslint-disable-next-line
    const [showModal, setShowModal] = useState(false); //this is used for the "recap modal", shows up at the confirmation of the order

    const [showModalClaim, setShowModalClaim] = useState(false) //this is used for the "claim date modal", shows up after clicking "continue"


    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    //cleanup use effect so that the client is not selected when you change date
    useEffect(() => {
        setSelectedClient("");
    }, [props.date])

    //this use Effect is used to load the clients when the component is loaded
    useEffect(() => {
        if (props.dirtyClients) {
            getClients()
                .then((res) => {
                    props.setClients(res)
                    props.setDirtyClients(false);
                })
        }
        if (!lastDate.isSame(props.date) || flag) {
            setLastDate(dayjs(props.date)); //update lastdate, so the useEffect will be triggered again
            getAvailableProducts(props.date)
                .then((res) => {
                    props.setProducts(res)
                })
            setFlag(false)
        }
    }, [props, flag, lastDate]);

    const calculateTotal = (elements) => {
        let total = parseFloat(0)
        //old memories
        for (let i = 0; i < elements.length; i++) {
            total = parseFloat(total) + parseFloat(elements[i].total)
        }
        return total.toFixed(2);
    }

    const checkQuantity = () => {
        if (productsSelected.length !== 0)
            setShowModalClaim(old => !old)
        else {
            setMessageProductRequest({
                type: "error",
                show: true,
                text: "Select the amount of at least one product"
            })
        }
    }

    const handleOrder = () => {
        if (productsSelected.length !== 0) {
            console.log(productsSelected)
            setSummary(productsSelected);
            //add the order in the db
            addPRequest(selectedClient,
                props.date,
                dayjs(claimdate).format("dd-mm-yyyy HH:mm"),
                null,
                deliveryAddress,
                null,
                "pending",
                productsSelected).then(result => {
                    // A few products are not available
                    console.log("risultato: ", result)
                    if (result.status !== undefined && result.status === 406)
                        setMessageProductRequest({
                            type: "error",
                            show: true,
                            text: result.listofProducts.map(x => x.name + " ").concat("are not available")
                        })
                    else if (result.status !== undefined && result.status === 200)
                        setMessageProductRequest({
                            type: "done",
                            show: true,
                            text: "Order received!" //this message won't be used. I don't remove it for consistency
                        })
                }).catch(err => {
                    console.log(err)
                    setMessageProductRequest({
                        type: "error",
                        show: true,
                        text: err.message //this message won't be used. I don't remove it for consistency
                    })
                })
                .finally(() => {
                    setProductsSelected([])
                })
            props.setDirtyAvailability(true)
        }
    }

    let sat9am;
    let sun23pm;
    if (dayjs(props.date).format('dddd') !== 'Sunday') {
        sat9am = dayjs(props.date).endOf('week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        sun23pm = dayjs(props.date).endOf('week').add(1, 'day').subtract(59, 'minute').subtract(59, 'second')
    } else {
        sat9am = dayjs(props.date).endOf('week').subtract(1, 'week').subtract(14, 'hour').subtract(59, 'minute').subtract(59, 'second')
        sun23pm = dayjs(props.date).endOf('week').subtract(1, 'week').add(1, 'day').subtract(59, 'minute').subtract(59, 'second')
    }

    return (<>
        {dayjs(props.date).isAfter(sat9am) && dayjs(props.date).isBefore(sun23pm) ?
            <Container className="justify-content-center mt-4">
                <h2>Enter a new product request</h2>
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
                            <ModalEnd showModal={messageProductRequest.show && messageProductRequest.type === "done"}
                                setShowModal={() => {
                                    setMessageProductRequest({
                                        type: messageProductRequest.type,
                                        show: false,
                                        text: messageProductRequest.text
                                    })
                                }}
                                handleCloseModal={handleCloseModal}
                                handleShowModal={handleShowModal}
                                products={{ summary: summary, total: calculateTotal(summary) }}
                                setDirtyAvailability={props.setDirtyAvailability} />
                            <Row>
                                <Col className="d-none d-md-block">
                                </Col>
                                <Col className="d-none d-md-block">
                                </Col>
                                <Col>
                                    <Form>
                                        <Form.Group className="mb-3" controlId="formProduct">
                                            <Form.Label></Form.Label>
                                            <Form.Control type="product" placeholder="Search product" onChange={(ev) => setProduct(ev.target.value)} />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            {messageProductRequest.show && messageProductRequest.type === "error" &&
                                <Alert className="mt-3" show={messageProductRequest.show} onClose={() => setMessageProductRequest({
                                    type: messageProductRequest.type,
                                    show: false,
                                    text: messageProductRequest.text
                                })} variant="danger" dismissible>{messageProductRequest.text}</Alert>
                            }
                            {productsSelected.length > 0 && <h4 style={{ marginLeft: "0rem", marginBottom: "1rem" }}>{"Total order"}: <strong>{calculateTotal(productsSelected)}</strong> €</h4>}
                            {showAlert ? <Alert dismissible onClose={() => setShowAlert(old => !old)} variant="info"><strong>Tooltip: </strong>To terminate product request press press   {reportAvailabilitiesSMALL}
                            </Alert> : ""}
                            <Table className="mt-1" style={{ marginBottom: "10rem" }} striped bordered hover responsive>
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
                            {showModalClaim &&
                                <ModalClaimDate show={showModalClaim}
                                    setShow={setShowModalClaim}
                                    claimdate={claimdate}
                                    setClaimdate={setClaimdate}
                                    clientAddress={props.clientAddress}
                                    address={deliveryAddress}
                                    setAddress={setDeliveryAddress}
                                    handleOrder={handleOrder} />}
                        </>
                            :
                            <Alert className="mt-3" variant="primary">There are no available products</Alert>}
                    </>
                }
                <Button className="order-btn position-fixed d-none d-md-block mx-auto rounded-circle pt-2" variant="yellow"
                    style={{ width: '4rem', height: '4rem', bottom: '3rem', zIndex: '100', right: '8rem' }}
                    onClick={() => checkQuantity()}>
                    {reportAvailabilitiesBIG}
                </Button>
                <HomeButton logged={props.logged} />

            </Container>
            :
            <>
                {
                    (dayjs(props.date).isBefore(sat9am)) ?
                        <Alert variant="danger" style={{ "fontWeight": "500" }}>
                            Orders will be available after Saturday morning at 9 am
                        </Alert>
                        :
                        <Alert variant="danger" style={{ "fontWeight": "500" }}>
                            Orders from clients are accepted until Sunday 23:00
                        </Alert>

                }
                <HomeButton className="home-here" logged={props.logged} />
            </>

        }
    </>)

}