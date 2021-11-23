import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Offcanvas, InputGroup, Form, Card, Container, Accordion, Alert } from "react-bootstrap";
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { iconFilter, arrowdown, arrowup, iconCart, iconSub, iconAdd, iconAddDisabled, iconSubDisabled } from "./Icons";
import HomeButton from './HomeButton';
import { getFarmers, getAvailableProducts } from "../API/API.js";
import dayjs from "dayjs";

export default function ProductsList(props) {
    const [selected, setSelected] = useState("");
    const [show, setShow] = useState(false);
    // eslint-disable-next-line
    const [rand, setRand] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let categories = [...new Set(props.products.map(prod => prod.category))];
    let [farmersPresent, setFarmersPresent] = useState([]);
    const [inserted, setInserted] = useState(false);
    const [lastDate, setLastDate] = useState(dayjs(props.date));
    //this use effect is used to get the available products
    useEffect(() => {
        console.log(lastDate)
        if ( props.dirtyAvailability || !lastDate.isSame(props.date) ){
            setLastDate(dayjs(props.date)); //update lastdate, so the useEffect will be triggered again
            getAvailableProducts(props.date)
                .then((res) => {
                    console.log(res)
                    props.setProducts(res)
                    props.setDirtyAvailability(false)
                    getFarmers()
                        .then((p) => {
                            props.setFarmers(p);
                            setFarmersPresent(props.products.map(prod => prod.farmerid));
                            setFarmersPresent(props.farmers.filter(f => farmersPresent.includes(f.userid)));
                        });
                })
       }
    }, [props.dirtyAvailability, props.setFarmers, farmersPresent, setFarmersPresent, props.date]);


    useEffect(() => {
        setTimeout(() => {
            setInserted(false);
        }, 5000);
    }, [inserted]);

    return (
        <>
            <Row className="pt-0" style={{ "fontWeight": "600", "backgroundColor": "#FFDEAD" }}>
                {categories.map((cat, index) =>
                    <Col className="border-end border-grey p-4" key={index}>
                        <div className="d-flex justify-content-around">
                            <Button className="btn-primary" id="main"
                                onClick={() => {
                                    setSelected(cat);
                                }}
                            >
                                <>{cat}</>
                            </Button>
                        </div>
                    </Col>)}
            </Row>
            <Container className="d-flex justify-content-around">
                <Row className="p-0 w-100">
                    <Col className="col-12 col-md-3 text-center">
                        <Button
                            className=" rounded-circle mt-3 "
                            onClick={() => { handleShow(); }}
                            style={{
                                right: '3rem', fontSize: "20px", "fontWeight": "400", width: '4rem', height: '4rem', bottom: '2rem', zIndex: '2', "backgroundColor": "#143642", color: "white"
                            }}>{iconFilter} </Button>

                    </Col>
                    <Col className=" col-12 col-md-6 mx-auto pl-0 text-center">
                        <div className="d-flex mt-4">
                            <h1 className="myTitle" style={{ fontSize: "40px" }}>Available Products</h1>
                        </div>
                    </Col>
                </Row>
                {inserted && <Alert className="position-fixed" variant="success"
                    style={{ bottom: '2rem', zIndex: '100', background: '#0C7373', color: "white" }}
                    variant={"success"}>
                    Product has been added to cart.
                </Alert>
                }
                <HomeButton logged={props.logged} />
            </Container>

            <Offcanvas show={show} onHide={handleClose} {...props} className="p-2" style={{ "backgroundColor": "#FFF3E0", color: "#5E3A08" }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontSize: "28px" }}>{selected}</Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                    <Offcanvas.Title style={{ fontSize: "30px", "fontWeight": "600" }}>Farmers:</Offcanvas.Title>
                    <Offcanvas.Title style={{ fontSize: "22px", color: "#A4660E" }}>selected in the research</Offcanvas.Title>
                    <InputGroup className="mt-3">
                        {
                            farmersPresent.map((farmer, index) => {
                                return (
                                    <Row className="w-100 mt-1 ms-2" key={index} style={{ fontSize: "22px", color: "#8D570C", "fontWeight": "500", }}>
                                        <Form.Check
                                            key={`row-farmer-${index}`}
                                            className=""
                                            type="checkbox"
                                            label={farmer.place}
                                            defaultChecked={true}
                                            onChange={(e) => { e.target.checked ? setRand(true) : setRand(false) }}
                                        />
                                    </Row>
                                );
                            })
                        }
                    </InputGroup>
                </Offcanvas.Body>
            </Offcanvas>
            <Row >
                <div className="d-flex justify-content-around selected-items">
                    <p style={{ fontSize: "30px" }}>{selected}</p>
                </div>
            </Row>
            <Row className="mt-3 d-block m-0">
                <Row className="mt-0 p-0 justify-content-center">
                    {props.products.filter(p => (selected) ? p.category === selected : true).map((prod, index) =>
                        <Product
                            prod={prod}
                            key={index}
                            logged={props.logged}
                            farmerName={props.farmers.filter(farmer => farmer.userid === prod.farmerid).place}
                            setInserted={setInserted}
                        />)}
                </Row>
            </Row>
        </>
    );
}

function Product(props) {

    const [counter, setCounter] = useState(0);

    //functions needed to select the quantity
    function add() {
        setCounter((c) => c + 1);
    }
    function sub() {
        setCounter((c) => c - 1);
    }

    function addToBasket() {
        props.setInserted(true);
        props.prod.quantity-=counter;
        setCounter(0);
    }

    return (
        <Accordion flush className="m-4 p-0 m-0" style={{ width: '15rem' }}>
            <Accordion.Item eventKey="0">
                <Card style={{ backgroundColor: "#FFEFD6" }}> {/*text-center*/}
                    <Card.Img variant="top" className="m-0" src={props.prod.picture} />
                    <Card.Body className="pb-0">
                        <CustomToggle eventKey="1" className="mt-1 mb-1 ">
                            <Card.Header className="myTitle d-inline" style={{ fontSize: "23px", "fontWeight": "600" }}>{props.prod.name}
                            </Card.Header>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Text className="p-3 pb-3 m-2 mt-3 cardDescription" >
                                <p className="mt-0 mb-1 myText">Farmer: {props.farmerName}</p>
                                <hr />
                                <p className="mt-0 mb-1 myText">Category: {props.prod.category}</p>
                                <hr />
                                <p className="mt-0 mb-0 myText">Type of production: {props.prod.typeofproduction}</p>
                                <hr />
                                <Accordion flush>
                                    <Accordion.Item eventKey="1">
                                        <Card className="border-0">
                                            <CustomToggle eventKey="1" className="mt-1 mb-1 myText"> Description: </CustomToggle>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body className="descriptionDiv mt-0 mb-0 cursive">{props.prod.description} </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion.Item>
                                </Accordion>
                            </Card.Text>
                        </Accordion.Collapse>
                    </Card.Body>
                    <Card.Footer className="mt-3">
                        <Container className="d-flex justify-content-between p-0">
                            <p style={{ fontSize: "22px", "fontWeight": "600" }} className="my-auto">Price:</p>
                            <InputGroup.Text className="priceDescription">{props.prod.price} €/{props.prod.measure}</InputGroup.Text>
                        </Container>
                    </Card.Footer>
                    {props.logged === "client" &&
                        <Card.Footer>
                            <Container className="d-flex justify-content-between p-0">
                                <InputGroup.Text className="priceDescription">
                                    {counter === 0 ?
                                        <span style={{ cursor: 'pointer' }}>{iconSubDisabled}</span>
                                        :
                                        <span style={{ cursor: 'pointer' }} onClick={() => { sub() }}>{iconSub}</span>
                                    }
                                    <p className="px-2 m-0">{counter} {props.prod.measure}</p>
                                    {counter >= props.prod.quantity ?
                                        <span style={{ cursor: 'pointer' }}>{iconAddDisabled}</span>
                                        :
                                        <span style={{ cursor: 'pointer' }} onClick={() => { add() }}>{iconAdd}</span>
                                    }
                                </InputGroup.Text>
                                <Button variant="primary" className="cartButton" onClick={() => { addToBasket() }}>{iconCart}</Button>
                            </Container>
                        </Card.Footer>
                    }
                </Card>
            </Accordion.Item>
        </Accordion>
    );
}

function CustomToggle({ children, eventKey }) {
    const [closed, setClosed] = useState(true);
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        setClosed(old => !old)
    );

    return (
        <p className="mt-1 mb-1 myText" onClick={decoratedOnClick}>{closed ? arrowdown : arrowup}{children}</p>
    );
}