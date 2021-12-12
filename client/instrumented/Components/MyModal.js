import { Modal, Button, Container } from "react-bootstrap";
import { topUpWallet } from "./Icons";
import QRCode from "react-qr-code";

export default function MyModal(props) {
  //console.log(props.userid)
  return (
    <>
      <Modal show={props.show} onHide={props.close}>
        <Modal.Header closeButton>
          <Modal.Title>Not suficient budget {topUpWallet}</Modal.Title>
        </Modal.Header>
        <Modal.Body>If you want to top up your wallet, go to the SPG office and ask a shop employee to do so. In order to do this, show: </Modal.Body>
        <Container className="mb-4 d-flex justify-content-center">
          <QRCode value={`http://localhost:3000/wallet/${props.userid}`} />
        </Container>
        <Modal.Footer>
          <Button variant="secondary" className="float-left" onClick={props.close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
