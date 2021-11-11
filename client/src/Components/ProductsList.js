import React, { useState } from 'react';
import { Row, Col, Button, ListGroup, Offcanvas, InputGroup, Form, Card } from "react-bootstrap";
import { useHistory } from 'react-router-dom';

export default function ProductsList(props) {
    const history = useHistory();
    function handle() {
        history.push("/");
    }
    const [selected, setSelected] = useState("");
    const [show, setShow] = useState(false);
    const [rand, setRand] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Row  className="pt-0" style={{ "fontWeight": "600", "backgroundColor": "#FFF3E0" }}>
                {props.categories.map((cat) =>
                    <Col className="border-end border-grey p-4">
                        <div className="d-flex justify-content-around">
                            <Button className="btn btn-primary" id="main" style={{ "backgroundColor": "#FFF3E0", "fontSize": "20px", "border": 1, "color": "#EC9A29" }}
                                onClick={() => {
                                    setSelected(cat);
                                    handleShow();
                                }}
                            >
                                <>{cat}</>
                            </Button>
                        </div>
                    </Col>)}
            </Row>
            <Row className="pt-3">
                <Col className="col-3 pt-2 ps-5">
                    <Button variant="danger" className="ms-3" onClick={() => handle()} style={{ fontSize: '18px', "backgroundColor": "#A8210A" }}>Back</Button>
                </Col>
                <Col className="col-6">
                    <div className="d-flex justify-content-around">
                        <h1>Available Products</h1>
                    </div>
                </Col>
                <Col className="justify-content-around col-3"></Col>
            </Row>
            <hr className="m-0 mt-3" />
            <Offcanvas show={show} onHide={handleClose} {...props} className="p-2" style={{ "backgroundColor": "#FFF3E0", color: "#5E3A08" }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontSize: "28px" }}>{selected}</Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                    <Offcanvas.Title style={{ fontSize: "25px" }}>Produttori:</Offcanvas.Title>
                    <Offcanvas.Title style={{ fontSize: "19px", color: "#A4660E" }}>selezionati nella ricerca</Offcanvas.Title>
                    <InputGroup className="mt-3">
                        {
                            props.farmers.map((farmer, index) => {
                                return (
                                    <Row key={`row-farmer-${index}`} className="w-100 mt-1 ms-2" style={{ fontSize: "20px", color: "#8D570C", "fontWeight": "500", }}>
                                        <Form.Check
                                            className=""
                                            type="checkbox"
                                            label={farmer}
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
            <Row>
                <Col>
                    <ListGroup variant='flush' className="">
                        {props.products.map((prod) =>
                            <Product
                                prod={prod}
                            />)}
                    </ListGroup>
                </Col>
            </Row>
        </>
    );
}

function Product(props) {
    return (
        <Row className="justify-content-between">
            <Card className="p-4" style={{ border: "0px" }}>
                <Card.Img variant="top" src={props.prod.picture} />
                <Card.Body>
                    <Card.Title style={{ fontSize: "22px" }}>{props.prod.name} <hr className="mt-1" /></Card.Title>
                    <Card.Text className="p-4">
                        <p className="mt-0 mb-1 myText">Farmer: NaN</p>
                        <p className="mt-0 mb-1 myText">Category: {props.prod.category}</p>
                        <p className="mt-0 mb-1 myText">Type of production: {props.prod.typeofproduction}</p>
                    </Card.Text>
                    <hr className="mt-0" />
                    <Col md={{ span: 3, offset: 10 }}>
                        <Button variant="primary" className="cartButton">Add to cart</Button>
                    </Col>
                </Card.Body>
            </Card>
        </Row>
    );
}