import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { arrowdown, arrowup, iconCart, iconSub, iconAdd, iconAddDisabled, iconSubDisabled } from "../Utilities/Icons";
import { Button, InputGroup, Card, Container, Accordion, Col, Row, Modal, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { React, useState } from 'react';

export default function Product(props) {

    //states used for the modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => { setShow(true); };

    const [counter, setCounter] = useState(0);

    //functions needed to select the quantity
    function add() {
        setCounter((c) => c + 0.5);
    }
    function sub() {
        setCounter((c) => c - 0.5);
    }

    function addToBasket() {
        if (counter > 0) {
            props.setInserted(true);
            let obj = { productid: props.prod.id, name: props.prod.name, quantity: counter, measure: props.prod.measure, price: props.prod.price, subtotal: props.prod.price * counter }
            let list;
            //i only want to have a single list of product in the session storage. I check if it already exists
            if (sessionStorage.getItem("productList")) {
                list = JSON.parse(sessionStorage.getItem("productList"))
            } else {
                //if the list doesn't exists, i create one empty
                list = [];
            }
            //add to the list the new object. if the object has never been added i can simply add it
            if (list.filter(el => el.productid === obj.productid).length === 0) {
                list = [...list, obj]
            } else {
                //otherwise i need to sum the quantity and the subtotal
                list = list.map(el => {
                    return el.productid === obj.productid ?
                        { ...el, quantity: el.quantity + obj.quantity, subtotal: el.subtotal + obj.subtotal }
                        : el
                })
            }

            //update the item in the sessionStorage
            sessionStorage.setItem("productList", JSON.stringify(list))

            //i update the local status
            props.prod.quantity -= counter;
            setCounter(0);
            props.setDirtyBasket(true)
        }
    }

    return (
        <>
            <Col md={3} xs={12} className="p-0 m-0 text-center mx-md-1">
                <Row className="m-0 p-0 justify-content-center">
                    <OverlayTrigger placement="bottom" delay={{ show: 600, hide: 0 }} overlay={renderTooltip}
                    >
                        <Card style={{ backgroundColor: "#FFEFD6", width: "85%" }} className="mb-3 p-2 another-product" > {/*text-center*/}
                            <Card.Img onClick={handleShow} variant="top" className="m-0 p-0" src={props.prod.picture} style={{ height: "100%", width: "100%" }} />
                            <Card.Body className="mt-2 p-0">
                                <Card.Header className="myTitle d-inline p-0 " style={{ fontSize: "23px", fontWeight: "600", backgroundColor: "#FFEFD6" }}>{props.prod.name}
                                </Card.Header>
                            </Card.Body>
                            <Card.Footer className="mt-3 p-0 mb-1">
                                <Row className="m-0 p-0">
                                    <Col><p style={{ fontSize: "1rem" }} className="my-auto">Price:
                                        <strong style={{ "fontWeight": "700" }}> {parseFloat(props.prod.price).toFixed(2)}€/{props.prod.measure}</strong></p></Col>
                                </Row>
                            </Card.Footer>
                            {props.logged === "client" &&
                                <Card.Footer className='p-1'>
                                    <Row className="justify-content-between p-4 pt-0 pb-0">
                                        <InputGroup.Text className="priceDescription">
                                            <Col md="3">
                                                {counter === 0 ?
                                                    <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }}>{iconSubDisabled}</Button>
                                                    :
                                                    <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }} onClick={() => { sub() }}>{iconSub}</Button>
                                                }
                                            </Col>
                                            <Col md="6">
                                                <p className="px-2 m-0">{parseFloat(counter).toFixed(1)} {props.prod.measure}</p>
                                            </Col>
                                            <Col md="3">
                                                {counter >= props.prod.quantity ?
                                                    <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }}>{iconAddDisabled}</Button>
                                                    :
                                                    <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }} onClick={() => { add() }}>{iconAdd}</Button>
                                                }
                                            </Col>
                                        </InputGroup.Text>
                                    </Row>
                                    <Button style={{ position: "absolute", top: "0px", left: "0px", zIndex: '100' }} variant="primary" className="cartButton" onClick={() => { addToBasket() }} size="sm">{iconCart}</Button>
                                </Card.Footer>
                            }
                        </Card>
                    </OverlayTrigger>
                    <Modal show={show} onHide={handleClose} size="lg" centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{props.prod.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className="mb-2">
                                <Col sm={8} className="my-auto">
                                    <p>
                                        <Image style={{ height: "1.5rem", width: "1.5rem", marginRight: "10px" }} src="https://cdn-icons-png.flaticon.com/512/498/498231.png" alt="Farmer" title="Farmer" class="loaded" />
                                        <strong>Farmer: </strong> {props.farmerName}</p>
                                    <p>
                                        <Image style={{ height: "1.5rem", width: "1.5rem", marginRight: "10px" }} src="https://cdn-icons-png.flaticon.com/512/498/498229.png" alt="Vegetables  free icon" title="Vegetables free icon" />
                                        <strong>Category: </strong>{props.prod.category}</p>
                                    <p className='mb-0'>
                                        <Image style={{ height: "1.5rem", width: "1.5rem", marginRight: "10px" }} src="https://cdn-icons-png.flaticon.com/512/498/498224.png" alt="Sunrise" title="Sunrise" class="loaded" />

                                        <strong>Type of production: </strong>{props.prod.typeofproduction}</p>
                                </Col>
                                <Col sm={3}>
                                    <Image src={props.prod.picture} style={{ height: "100%", width: "100%" }} />
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Accordion flush style={{ width: "100%" }}>
                                <Accordion.Item eventKey="1">
                                    <Card className="border-0">
                                        <CustomToggle eventKey="1" className="mt-1 mb-1 myText">
                                            <span><Image style={{ height: "1.5rem", width: "1.5rem", marginRight: "10px", marginLeft: "5px" }} src="https://cdn-icons-png.flaticon.com/512/498/498260.png" alt="Stall" title="Stall" class="loaded" />
                                                <strong style={{ fontSize: "1rem" }}>Description: </strong></span></CustomToggle>
                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body className="mt-0 mb-0">{props.prod.description} </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion.Item>
                            </Accordion>

                        </Modal.Footer>
                    </Modal>
                </Row>
            </Col >

        </>
    );
}

//utilities function

function CustomToggle({ children, eventKey }) {
    const [closed, setClosed] = useState(true);
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        setClosed(old => !old)
    );

    return (
        <p className="mt-1 mb-1 myText" onClick={decoratedOnClick}>{closed ? arrowdown : arrowup}{children}</p>
    );
}

const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Click to know more
    </Tooltip>
);