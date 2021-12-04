import { Card, Button, ButtonGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ShopEmployeeHome() {
    return (
        <Container className="justify-content-center">
            <Card className="mt-4">
                <Card.Header as="h5">What is your task?</Card.Header>
                <Card.Body className="mb-2">
                    <ButtonGroup vertical aria-label="Directions" className="d-flex" >
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprodreq">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/productRequest" className="py-2 yellowLink">
                                Enter product Request
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toregcl">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/registerClient"className="py-2 yellowLink">
                                Register new client
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="topup">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/wallet/0" className="py-2 yellowLink">
                                Top-up a client's wallet
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprod">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/products" className="py-2 yellowLink">
                                Browse available products
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="tohand">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/handout" className="py-2 yellowLink">
                                Record products handout
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="tohand">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/manageOrders" className="py-2 yellowLink">
                                Manage orders pending cancelation
                            </Link>
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </Container>
    );
}