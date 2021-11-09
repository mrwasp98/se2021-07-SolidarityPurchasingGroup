import React, { useState } from 'react';
import { Row, Col, Button, ListGroup, Offcanvas, InputGroup } from "react-bootstrap";
import { useHistory } from 'react-router-dom';

export default function ProductsList(props) {
    const history = useHistory();
    function handle() {
        history.push("/");
    }
    const [selected, setSelected] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Row className="">
                <Col className="col-3 pt-1 ps-5">
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
            <Row style={{ "fontWeight": "600", "backgroundColor": "#FFF3E0" }}>
                {props.categories.map((cat) =>
                    <Col className="border-end border-grey p-4">
                        <div className="d-flex justify-content-around">
                            <Button className="btn btn-primary" id="main" style={{ "backgroundColor": "#FFF3E0", "fontSize": "18px", "border": 1, "color": "#EC9A29" }}
                                onClick={() => {
                                    setSelected(cat);
                                    handleShow();
                                }}
                            >
                                <>{cat}</>
                            </Button>
                        </div>
                    </Col>)}
                <Offcanvas show={show} onHide={handleClose} {...props} className="p-2" style={{ "backgroundColor": "#FFF3E0", color: "#5E3A08" }}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title style={{ fontSize: "25px" }}>{selected}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <hr />
                    <Offcanvas.Body>
                        <Offcanvas.Title style={{ fontSize: "22px" }}>Produttori:</Offcanvas.Title>
                        <InputGroup>
                            {
                                props.farmers.map((farmer, index) => {
                                    return (
                                        <Row key={`row-farmer-${index}`} className="w-100">
                                            <Col>
                                                <InputGroup.Checkbox
                                                    value={index}
                                                    key={`farmer-${index}`}
                                                    id={`checkbox-${index}`}
                                                    onChange={() => { }} />
                                            </Col>
                                            <Col>
                                                <span style={{ marginLeft: '1em' }}>{farmer}</span>
                                            </Col>
                                        </Row>
                                    );
                                })
                            }
                        </InputGroup>
                    </Offcanvas.Body>
                </Offcanvas>
            </Row>
            <Row>
                <Col>
                    <ListGroup variant='flush'>
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
        <></>
    );
}