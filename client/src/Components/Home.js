
import { Carousel, Container, Row, Col } from "react-bootstrap";

export default function Handout(props) {
    return (
        <Container className="justify-content-center text-center">
            <Carousel className="mb-3">
                <Carousel.Item interval={3000}>
                    <img
                        className="d-block w-100"
                        src="/carousel/dairy.jpg"
                        alt="Diary"
                    />
                    <Carousel.Caption>
                        <h3 className="text-yellow py-2" style={{ background: "#14364290" }}>High quality dairy products</h3>

                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3000}>
                    <img
                        className="d-block w-100"
                        src="/carousel/veggies.jpg"
                        alt="Vegetables"
                    />
                    <Carousel.Caption >
                        <h3 className="py-2 text-yellow" style={{ background: "#14364290" }}>Fresh vegetables and fruits</h3>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={3000}>
                    <img
                        className="d-block w-100"
                        src="/carousel/meat.jpg"
                        alt="Meat"
                    />
                    <Carousel.Caption>
                        <h3 className="text-yellow py-2" style={{ background: "#14364290" }}>Tender meat</h3>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <h1 className="mb-5">Welcome to solidarity purchasing group!</h1>

            <Container>
                <Row className="justify-content-center">
                    <Col sm={4}><img src="/carousel/bread.png" alt="Diary" className="d-block h-25 mx-auto" /></Col>
                    <Col sm={4}><img src="/carousel/meat.png" alt="Diary" className="d-block h-25 mx-auto"/></Col>
                    <Col sm={4}><img src="/carousel/broccoli.png" alt="Diary"className="d-block h-25 mx-auto" /></Col>
                </Row>
            </Container>
        </Container>
    )
}