
import { Carousel, Container, Row, Col, Button } from "react-bootstrap";

export default function Handout(props) {
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
                <h1 className="mb-5">Welcome to solidarity purchasing group!</h1>
            </Container>
            <Container className="d-flex justify-content-center ">
                <Row className="justify-content-center">
                    <Col sm={4} className="text-center division pb-3">
                        <img src="/carousel/bread.png" alt="Bread" className="d-block mx-auto my-2" style={{ height: "100px" }} />
                        <span><strong>A new way of thinking.</strong> <br /> Embrace the new economy and partake in the global food revolution, zero kilometer food is the future.</span>
                    </Col>
                    <Col sm={4} className="text-center division pb-3">
                        <img src="/carousel/meat.png" alt="Meat" className="d-block mx-auto my-2" style={{ height: "100px" }} />
                        <span><strong>Exceptional Quality.</strong> <br /> Our local farmer are respecting all the high quality standars that are hard to find in mass market.</span>
                    </Col>
                    <Col sm={4} className="text-center division pb-3">
                        <img src="/carousel/broccoli.png" alt="Broccoli" className="d-block mx-auto my-2" style={{ height: "100px" }} />
                        <span><strong>From soil to your table.</strong> <br />You will be able to enjoy the most delicious vegetables, wihtout overlooking sustainability.</span>
                    </Col>
                </Row>
            </Container>
            <Container className="my-4">
                <Row className="text-center">
                    <Col sm={12} md={6}>
                        <h2>What are you waiting for?</h2>
                    </Col>
                    <Col sm={12} md={6}>
                        <Button variant="yellow" size="lg">Join us!</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}