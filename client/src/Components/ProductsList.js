import React, { useState } from 'react';
import { Row, Col, Button, ListGroup, Offcanvas } from "react-bootstrap";
import { useHistory } from 'react-router-dom';

export default function ProductsList(props) {
    const history = useHistory();
    function handle() {
        history.push("/");
    }
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
            <hr className="m-0 mt-1" />
            <Row className="ms-2" style={{ "fontWeight": "600", "backgroundColor": "#FFF3E0" }}>
                {props.categories.map((cat) =>
                    <Col className="border-end border-grey p-4">
                        <div className="d-flex justify-content-around">
                            <Button className="btn" id="main" style={{ "backgroundColor": "#FFF3E0", "fontSize": "18px", "border": 1, "color":"#EC9A29" }} onClick={handleShow}>
                                <>{cat}</>
                            </Button>
                        </div>
                    </Col>)}
                <Offcanvas show={show} onHide={handleClose} {...props}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        Some text as placeholder. In real life you can have the elements you
                        have chosen. Like, text, images, lists, etc.
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