import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Offcanvas, InputGroup, Form, Container, Alert } from "react-bootstrap";
import { showmore } from "../Utilities/Icons";
import HomeButton from '../Utilities/HomeButton';
import { getFarmers, getAvailableProducts } from "../../API/API";
import dayjs from "dayjs";
import Product from "./Product"

export default function ProductsList(props) {
    const [selected, setSelected] = useState("All");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let categories = [...new Set(props.products.map(prod => prod.category))];
    const [farmersPresent, setFarmersPresent] = useState([]);
    const [selectedFarmers, setSelectedFarmers] = useState([]);
    const [inserted, setInserted] = useState(false);
    const [lastDate, setLastDate] = useState(dayjs(props.date));
    const [flag, setFlag] = useState(true)
    const [showfilters, setShowFilters] = useState("none")
    const [product, setProduct] = useState("") //this state is used to control the search bar

    //this use effect is used to get the available products and the farmers
    useEffect(() => {
        if (props.dirtyAvailability || !lastDate.isSame(props.date) || flag) {
            let list;
            setLastDate(dayjs(props.date)); //update lastdate, so the useEffect will be triggered again
            getAvailableProducts(props.date)
                .then((res) => {
                    props.setProducts(res)
                    props.setDirtyAvailability(false)
                    list = res.map(prod => prod.farmerid)
                    setSelectedFarmers(list)
                }).then(() => {
                    getFarmers()
                        .then((p) => {
                            props.setFarmers(p);
                            setFarmersPresent(p.filter(f => list.includes(f.userid)))
                        });
                })
            setFlag(false)
        }
        // eslint-disable-next-line
    }, [props.dirtyAvailability, props.date, props.setProducts, flag]);

    //this use effect is used to show a message when the cart button is clicked
    useEffect(() => {
        setTimeout(() => {
            setInserted(false);
        }, 5000);
    }, [inserted]);

    //this use effect is called when something is deleted from the basket. 
    //it is meant to realling the quantities
    useEffect(() => {
        if (props.dirtyQuantity.length > 0) {
            let list = props.products.map(prod => {
                return prod.id === props.dirtyQuantity[0] ?
                    { ...prod, quantity: prod.quantity + props.dirtyQuantity[1] }
                    : prod
            })
            props.setProducts(list)
            props.setDirtyQuantity([]);
        }
        // eslint-disable-next-line
    }, [props.setDirtyQuantity, props.dirtyQuantity, props.products, props.setProducts])

    function showFarmer(id) {
        if (!selectedFarmers.includes(id)) {
            setSelectedFarmers(old => [...old, id])
        }
    }
    function hideFarmer(id) {
        if (selectedFarmers.includes(id)) {
            setSelectedFarmers(old => old.filter(el => el !== id))
        }
    }

    return (
        <>
            {/* this row is the one used for filters and search bar */}
            <Row className="p-0 m-0" style={{ "backgroundColor": "#FFDEAD", maxWidth: "100%" }}>
                <Col className="my-auto text-sm-center text-left mx-0" xs={8} sm={2}>
                    <Button className="farmers-filter important-buttons-product-list mt-1  m-l-sm-0" style={{ "fontSize": "0.8rem" }}
                        onClick={() => { handleShow(); }}>
                        Farmer filter
                    </Button>
                </Col>

                <Col className="my-auto mx-0 p-0 d-sm-none " xs={4}>
                    <Button className="px-3 pt-0 important-buttons-product-list mt-1 mx-5" style={{ "fontSize": "1rem" }}
                        onClick={() => { setShowFilters(old => old === "none" ? "block" : "none") }}>
                        {showmore}
                    </Button>
                </Col>

                {categories.map((cat, index) =>
                    <Col  onClick={() => {setSelected(cat);}} 
                        className={"border-end border-grey my-auto text-center d-sm-block hover-category d-" + showfilters} xs={12} sm={1} key={index}>
                        <Button className={index === 2 ? "btn-primary mx-1 px-1 py-2" : "btn-primary mx-1 px-0"} style={{ "fontSize": "0.8rem" }} id="main"
                           >
                            <>{cat}</>
                        </Button>
                    </Col>
                )}
                <Col onClick={() => { setSelected("All"); }} 
                    className={"border-end border-grey p-0 my-auto text-center d-sm-block hover-category d-" + showfilters} xs={12} sm={1}>
                    <Button className="btn-primary py-2 mt-1" style={{ "fontSize": "0.8rem" }} id="main">
                        <>All</>
                    </Button>
                </Col>
                <Col style={{ "minWidth": "200px" }} className='p-0'>
                    <Form className="d-flex align-items-start my-2 p-0">
                        <Form.Control type="product" placeholder="Search product" onChange={(ev) => {setProduct(ev.target.value)}} />
                    </Form>
                </Col>
            </Row>

            {/* title of the page and utilities */}
            <Container className="d-flex justify-content-around">
                <Row className="p-0 w-100 mt-4">
                    <Col className="mx-auto pl-0 text-center mt-4">
                        <h1 className="myPageTitle">Available Products : <u className=""> {selected} </u></h1>
                    </Col>
                </Row>
                {inserted && <Alert className="position-fixed" variant="success"
                    style={{ bottom: '3rem', zIndex: '100', background: '#0C7373', color: "white" }} >
                    Product has been added to cart.
                </Alert>}
                <HomeButton className="home-here" logged={props.logged} />
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
                                            type="checkbox"
                                            label={farmer.place}
                                            defaultChecked={selectedFarmers.includes(farmer.userid)}
                                            onChange={(e) => { e.target.checked ? showFarmer(farmer.userid) : hideFarmer(farmer.userid) }}
                                        />
                                    </Row>
                                );
                            })
                        }
                    </InputGroup>
                </Offcanvas.Body>
            </Offcanvas>

            <Row className="mt-3 d-block m-0">
                <Row className="m-0 p-0 justify-content-center">
                    {props.products.filter(p => ((selected) ? (p.category === selected || selected === "All") && (selectedFarmers.includes(p.farmerid)) : false) && p.name.toLowerCase().includes(product.toLowerCase())).map((prod, index) =>
                        <Product
                            prod={prod}
                            key={index}
                            logged={props.logged}
                            farmerName={farmersPresent.length > 0 && farmersPresent.filter(farmer => farmer.userid === prod.farmerid)[0] && farmersPresent.filter(farmer => farmer.userid === prod.farmerid)[0].place}
                            setInserted={setInserted}
                            setDirtyBasket={props.setDirtyBasket}
                        />)}
                </Row>
            </Row>
        </>
    );
}