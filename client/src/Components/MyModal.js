import { Modal, Button } from "react-bootstrap";
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
          <Button variant="secondary" className="float-left" onClick={props.close}>
              Close
            </Button>     
          </Modal.Footer>
        </Modal>
      </>
    );
  }
