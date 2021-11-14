import React, { useState } from 'react';
import { Row, Col, Button, ListGroup, Offcanvas, InputGroup, Form, Card } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { iconCart, iconFilter } from "./Icons";
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
    let categories = [...new Set(props.products.map(prod => prod.category))];
    let farmersPresent = props.products.map(prod => prod.farmerid);
    farmersPresent = props.farmers.filter(f => farmersPresent.includes(f.userid));
    return (
        <>
            <Row className="pt-0" style={{ "fontWeight": "600", "backgroundColor": "#FFDEAD" }}>
                {categories.map((cat) =>
                    <Col className="border-end border-grey p-4">
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
            <Row className="pt-3">
                <Col className="col-3 pt-2 ps-5">
                    <Button
                        className="cartButton mt-3"
                        onClick={() => {
                            handleShow();
                        }}
                        style={{
                            right: '3rem', fontSize: "20px", "fontWeight": "400", width: '8rem', height: '3rem', bottom: '2rem', right: '3rem', zIndex: '2'
                        }}>{iconFilter} Farmers</Button>
                    <Button variant="danger" className="ms-3 position-fixed" onClick={() => handle()}
                        style={{
                            fontSize: '24px', "backgroundColor": "#A8210A",
                            width: '5rem', height: '3rem', bottom: '2rem', right: '3rem', zIndex: '2'
                        }}>Back</Button>
                </Col>
                <Col className="col-6">
                    <div className="d-flex justify-content-around mt-4">
                        <h1 className="myTitle" style={{ fontSize: "40px" }}>Available Products</h1>
                    </div>
                </Col>
                <Col className="justify-content-around col-3">

                </Col>
            </Row>
            <Offcanvas show={show} onHide={handleClose} {...props} className="p-2" style={{ "backgroundColor": "#FFF3E0", color: "#5E3A08" }}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title style={{ fontSize: "28px" }}>{selected}</Offcanvas.Title>
                </Offcanvas.Header>
                <hr />
                <Offcanvas.Body>
                    <Offcanvas.Title style={{ fontSize: "25px", "fontWeight": "600" }}>Farmers:</Offcanvas.Title>
                    <Offcanvas.Title style={{ fontSize: "19px", color: "#A4660E" }}>selected in the research</Offcanvas.Title>
                    <InputGroup className="mt-3">
                        {
                            farmersPresent.map((farmer, index) => {
                                return (
                                    <Row className="w-100 mt-1 ms-2" style={{ fontSize: "20px", color: "#8D570C", "fontWeight": "500", }}>
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
                <div className="d-flex justify-content-around">
                    <p style={{ fontSize: "30px" }}>{selected}</p>
                </div>
            </Row>
            <Row className="p-5 m-5 mt-0">
                <Row className="ps-5 ms-5 pe-5 me-5 mt-0">
                    {props.products.map((prod) =>
                        <Product
                            prod={prod}
                        />)}
                </Row>
            </Row>
        </>
    );
}

function Product(props) {
    return (
        <Card className="m-3 p-0 myCard text-center" style={{ width: '20rem', backgroundColor: "#FFEFD6" }}>
            <Card.Img variant="top" className="m-0" src={props.prod.picture} />
            <Card.Body className="pb-0">
                <Card.Header className="myTitle" style={{ fontSize: "23px", "fontWeight": "600" }}>{props.prod.name}</Card.Header>
                <Card.Text className="p-3 pb-3 m-2 mt-3 cardDescription" >
                    <p className="mt-0 mb-1 myText">Farmer: NaN</p>
                    <p className="mt-0 mb-1 myText">Category: {props.prod.category}</p>
                    <p className="mt-0 mb-0 myText">Type of production: {props.prod.typeofproduction}</p>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="mt-3">
                <Row >
                    <Col className="ps-3 mb-3">
                        <p style={{ display: "inline", fontSize: "21px", "fontWeight": "600" }}>Price:</p>
                        <Col md={{ span: 7, offset: 3 }}>
                            <InputGroup className="priceGroup mt-1">
                                <InputGroup.Text className="priceDescription">{props.prod.price}</InputGroup.Text>
                                <InputGroup.Text className="priceDescription">€</InputGroup.Text>
                                <InputGroup.Text className="priceDescription">{props.prod.measure}</InputGroup.Text>
                            </InputGroup>
                        </Col>
                        {/*<Button variant="primary" className="cartButton">{iconCart}</Button>*/}
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
}