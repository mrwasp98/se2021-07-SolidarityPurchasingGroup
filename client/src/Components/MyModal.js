import { Modal, Button,Container } from "react-bootstrap";
import { topUpWallet } from "./Icons";

export default function MyModal(props) {

    return (
      <>
        <Modal show={props.show} onHide={props.close}>
          <Modal.Header closeButton>
            <Modal.Title>Not suficient budget {topUpWallet}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to increase your wallet!? </Modal.Body>
          <Modal.Footer>
          <Container className="d-flex justify-content-between my-4">
            
          <Button variant="secondary" className="float-left" onClick={props.close}>
              Close
            </Button>
            <Button variant="primary" onClick={props.close}>
              Top Up Your Wallet
            </Button>
            </Container>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
