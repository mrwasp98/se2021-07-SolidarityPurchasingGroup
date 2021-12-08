/*
This component is used to inform the client that their order has been recorded into the system.
*/

import { Form, Button, Modal, Alert} from "react-bootstrap";

export default function ModalEnd(props) {
    return (
        <Modal show={props.showModal} handleClose={props.handleCloseModal} backdrop="static">
            <Modal.Header>
                <Modal.Title style={{ width: "100%" }}><Alert variant="success" >Order received!</Alert></Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <Form.Group controlId='selectedName'>
                        <Form.Label>Summary of order</Form.Label>
                        <ul>
                            {props.products.summary.map((x, i) => <li key={i}>{x.quantity + " " + x.measure + " of " + x.name}</li>)}
                        </ul>
                        <p>Total: {props.products.total}€</p>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        props.setShowModal(false)
                        props.setDirtyAvailability(true)
                    }}>Ok</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}