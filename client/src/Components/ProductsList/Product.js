import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { arrowdown, arrowup, iconCart, iconSub, iconAdd, iconAddDisabled, iconSubDisabled } from "../Utilities/Icons";
import { Button, InputGroup, Card, Container, Accordion, Col, Row } from "react-bootstrap";
import { React, useState } from 'react';

export default function Product(props) {

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
        <Col md={2} xs={9} className="p-0 m-0 text-center mx-md-1">
        <Card style={{ backgroundColor: "#FFEFD6", width: "90%"}} className="mx-auto mb-3"> {/*text-center*/}
            <Card.Img variant="top" className="m-0" src={props.prod.picture} style={{height: "100%", width: "100%"}} />
            <Card.Body className="mt-2 p-0">
                <Card.Header className="myTitle d-inline p-0 " style={{ fontSize: "23px", fontWeight: "600", backgroundColor: "#FFEFD6" }}>{props.prod.name}
                </Card.Header>

              {/*   <Accordion.Collapse eventKey="1">
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
                </Accordion.Collapse> */}
            </Card.Body>
            <Card.Footer className="mt-3 p-0 mb-1">
                <Row className="m-0 p-0">
                    <Col><p style={{ fontSize: "1rem"}} className="my-auto">Price: 
                    <strong style={{ "fontWeight": "700" }}> {parseFloat(props.prod.price).toFixed(2)}€/{props.prod.measure}</strong></p></Col>
                </Row>
            </Card.Footer>

            {props.logged === "client" &&
                <Card.Footer className='p-0'>
                    <Container className="d-flex justify-content-between p-0">
                        <InputGroup.Text className="priceDescription">
                            {counter === 0 ?
                                <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }}>{iconSubDisabled}</Button>
                                :
                                <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }} onClick={() => { sub() }}>{iconSub}</Button>
                            }
                            <p className="px-2 m-0">{parseFloat(counter).toFixed(1)} {props.prod.measure}</p>
                            {counter >= props.prod.quantity ?
                                <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }}>{iconAddDisabled}</Button>
                                :
                                <Button className="p-0" variant="flat" style={{ backgroundColor: "white", boxShadow: 'none' }} onClick={() => { add() }}>{iconAdd}</Button>
                            }
                        </InputGroup.Text>
                        <Button variant="primary" className="cartButton" onClick={() => { addToBasket() }} size="sm">{iconCart}</Button>
                    </Container>
                </Card.Footer>
            }
        </Card>
        </Col>
    );
}

// function CustomToggle({ children, eventKey }) {
//     const [closed, setClosed] = useState(true);
//     const decoratedOnClick = useAccordionButton(eventKey, () =>
//         setClosed(old => !old)
//     );

//     return (
//         <p className="mt-1 mb-1 myText" onClick={decoratedOnClick}>{closed ? arrowdown : arrowup}{children}</p>
//     );
// }