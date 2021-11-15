import React, { useState } from 'react';
import { Row, Col, Button, ListGroup, Offcanvas, InputGroup, Form, Card } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import { iconFilter, home } from "./Icons";
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
                            right: '3rem', fontSize: "20px", "fontWeight": "400", width: '14rem', height: '3rem', bottom: '2rem', right: '3rem', zIndex: '2'
                        }}>Select Farmers {iconFilter} </Button>
                    <Button
                        className='position-fixed rounded-circle'
                        style={{ width: '5rem', height: '5rem', bottom: '3rem', right: '3rem', zIndex: '2', "backgroundColor": "#143642", color: "white" }}
                        onClick={() => handle()}>
                        {home}
                    </Button>
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
                    <Offcanvas.Title style={{ fontSize: "30px", "fontWeight": "600" }}>Farmers:</Offcanvas.Title>
                    <Offcanvas.Title style={{ fontSize: "22px", color: "#A4660E" }}>selected in the research</Offcanvas.Title>
                    <InputGroup className="mt-3">
                        {
                            farmersPresent.map((farmer, index) => {
                                return (
                                    <Row className="w-100 mt-1 ms-2" style={{ fontSize: "22px", color: "#8D570C", "fontWeight": "500", }}>
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
            <Row className="mt-3 pt-5">
                <Row className="mt-0 justify-content-center">
                    {props.products.filter(p => (selected) ? p.category === selected : true).map((prod) =>
                        <Product
                            prod={prod} farmerName={props.farmers.filter(farmer => farmer.userid === prod.farmerid)[0].place}
                        />)}
                </Row>
            </Row>
        </>
    );
}

function Product(props) {
    return (
        <Card className="m-4 myCard p-0" style={{ width: '25rem', backgroundColor: "#FFEFD6" }}> {/*text-center*/}
            <Card.Img variant="top" className="m-0" src={props.prod.picture} />
            <Card.Body className="pb-0">
                <Card.Header className="myTitle" style={{ fontSize: "23px", "fontWeight": "600" }}>{props.prod.name}</Card.Header>
                <Card.Text className="p-3 pb-3 m-2 mt-3 cardDescription" >
                    <p className="mt-0 mb-1 myText">Farmer: {props.farmerName}</p>
                    <p className="mt-0 mb-1 myText">Category: {props.prod.category}</p>
                    <p className="mt-0 mb-0 myText">Type of production: {props.prod.typeofproduction}</p>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="mt-3">
                <Row >
                    <Col className="mb-3">
                        <p style={{ display: "inline", fontSize: "21px", "fontWeight": "600" }}>Price:</p>
                        <Col md={{ span: 8, offset: 3 }}>
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