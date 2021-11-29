import { Card, Button, ButtonGroup, Container } from "react-bootstrap";
import HomeButton from './HomeButton';
import { Link } from "react-router-dom";

export default function Type() {
    return (
        <Container className="justify-content-center">
            <Card className="mt-4">
                <Card.Header as="h5">Choose the account type</Card.Header>
                <Card.Body className="mb-2">
                    <ButtonGroup vertical aria-label="Directions" className="d-flex" >
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toCreateClient">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/user/client" className="py-2 yellowLink">
                                Client
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toCreateFarmer">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/user/farmer"className="py-2 yellowLink">
                                Farmer
                            </Link>
                        </Button>
                        <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toCreateShopEmployee">
                            <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/user/shopemployee" className="py-2 yellowLink">
                                Shop Employee
                            </Link>
                        </Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
            <HomeButton logged={"false"} />
        </Container>
    );
}