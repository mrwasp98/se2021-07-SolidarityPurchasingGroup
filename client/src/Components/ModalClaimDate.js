/*
This component is used to let the client choose time and date for the pickup
*/

import { Form, Button, Modal, Row, Col, Container, } from "react-bootstrap";
import { useState, } from "react";
// import { DateInput, TimeInput } from "semantic-ui-react-datetimeinput";

export default function ModalEnd(props) {
    const [show, setShow] = useState(true);
    const [datetime, setDatetime] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Please, select date and time to pick up your order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Remember, pickups take place from
                        <strong> Wednesday morning (9:00 AM) </strong>
                        until
                        <strong> Friday evening (9:00 PM)</strong>
                        .
                    </div>
                    <Container>
                        {/* <DateInput dateValue={datetime} onDateValueChange={() => { }} />
                        <TimeInput dateValue={datetime} onDateValueChange={() => { }} /> */}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary">Understood</Button>
                    </Col>
                </Modal.Footer>
            </Modal>
        </>
    );
}