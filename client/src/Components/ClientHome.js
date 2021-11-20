import { Card, Button, ButtonGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ClientHome() {
    return (
        <Container className="justify-content-center">
            <Card className="mt-4">
                <Card.Header as="h5">What do you want to do?</Card.Header>
                <Card.Body className="mb-2">
                    <ButtonGroup vertical aria-label="Directions" className="d-flex" >
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprodreq">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/products" className="py-2 yellowLink">
                                Buy some products
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toregcl">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="#"className="py-2 yellowLink">
                                Top up your wallet
                            </Link>
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </Container>
    );
}