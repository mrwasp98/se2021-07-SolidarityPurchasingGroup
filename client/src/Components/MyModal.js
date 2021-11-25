//import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { topUpWallet } from "./Icons";

export default function MyModal(props) {
    //const [show, setShow] = useState(true);
console.log("Modal: "+props.show);
   // const handleClose = () => setShow(false);
   // const handleShow = () => setShow(true);
  
    return (
      <>
        {/* <Button variant="primary" onClick={handleShow}>
          
        </Button>
   */}
        <Modal show={props.show} onHide={props.close}>
          <Modal.Header closeButton>
            <Modal.Title>Not suficient budget {topUpWallet}</Modal.Title>
          </Modal.Header>
          <Modal.Body>Do you want to increase your wallet!? </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.close}>
              Close
            </Button>
            <Button variant="primary" onClick={props.close}>
              Top Up Your Wallet
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
