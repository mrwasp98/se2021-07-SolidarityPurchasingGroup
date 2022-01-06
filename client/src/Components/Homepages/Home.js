import { Link } from 'react-router-dom';
import { Carousel, Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";

export default function Home(props) {
    return (
        <>
            <Carousel className="mb-3 d-none d-md-block" >
                <Carousel.Item interval={3000}>
                    <img style={{ height: '22rem' }}
                        className="d-block w-100"
                        src="/carousel/dairy.jpg"
                        alt="Diary"
                    />
                    <Carousel.Caption>
                        <h3 className="text-yellow py-2" style={{ background: "#14364240" }}>High quality dairy products</h3>

                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3000}>
                    <img style={{ height: '22rem' }}
                        className="d-block w-100"
                        src="/carousel/veggies.jpg"
                        alt="Vegetables"
                    />
                    <Carousel.Caption >
                        <h3 className="py-2 text-yellow" style={{ background: "#14364250" }}>Fresh vegetables and fruits</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3000}>
                    <img style={{ height: '22rem' }}
                        className="d-block w-100"
                        src="/carousel/meat.jpg"
                        alt="Meat"
                    />
                    <Carousel.Caption>
                        <h3 className="text-yellow py-2" style={{ background: "#14364240" }}>Tender meat</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container className="d-flex justify-content-center" >
                <h1 className="mb-5 mt-4">Welcome to solidarity purchasing group!</h1>
            </Container>
            <Container className="d-flex justify-content-center ">
                <Row className="justify-content-center">
                    <Col sm={4} className="text-center pb-3">
                        <img src="/carousel/bread.png" alt="Bread" className="d-block mx-auto my-2" style={{ height: "100px" }} />
                        <span><strong>A new way of thinking.</strong> <br /> Embrace the new economy and partake in the global food revolution, zero kilometer food is the future.</span>
                    </Col>
                    <Col sm={4} className="text-center pb-3">
                        <img src="/carousel/meat.png" alt="Meat" className="d-block mx-auto my-2" style={{ height: "100px" }} />
                        <span><strong>Exceptional Quality.</strong> <br /> Our local farmer are respecting all the high quality standars that are hard to find in mass market.</span>
                    </Col>
                    <Col sm={4} className="text-center pb-3">
                        <img src="/carousel/broccoli.png" alt="Broccoli" className="d-block mx-auto my-2" style={{ height: "100px" }} />
                        <span><strong>From soil to your table.</strong> <br />You will be able to enjoy the most delicious vegetables, wihtout overlooking sustainability.</span>
                    </Col>
                </Row>
            </Container>
            <Container className="footerHomePage">
                <Row>
                    <Col className="p-4 text-aligned-right division" sm={6}>
                        <p className="footerTitle">SPG GROUP 07</p>
                        <p className="footerInfo">Corso Duca degli Abruzzi, 24</p>
                        <p className="footerInfo">10129 Torino, ITALY</p>
                        <p className="footerInfo">P.IVA/C.F.: 00518460019</p>

                    </Col>
                    <Col className="p-4" sm={6}>
                        <p className="footerTitleDx">USEFUL LINKS</p>
                            <Link to="/products">
                                <Button className="footerButton" id="homepage_browseproducts" variant="yellow" size="md">Browse products for next week!</Button>
                            </Link>
                            <Link to="/user">
                                <Button className="footerButton" id="homepage_joinus " variant="yellow" size="md">Join us!</Button>
                            </Link>
                    </Col>
                </Row>
            </Container>
        </>
    )
}