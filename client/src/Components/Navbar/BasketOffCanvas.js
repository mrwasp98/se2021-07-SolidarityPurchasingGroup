import { addPRequest } from '../../API/API';
import ModalClaimDate from "../Utilities/ModalClaimDate"
import ModalEnd from '../Utilities/ModalEnd';
import { Container, Button, Row, Col, Table, ListGroup, Offcanvas } from "react-bootstrap";
import { cartFill, cross, coin } from "../Utilities/Icons";
import { useState, useEffect, React } from "react";
import dayjs from "dayjs";

export default function BasketOffCanvas(props) {
  const [elements, setElements] = useState([]); //these are the selected products
  const [claimdate, setClaimdate] = useState(new Date());
  const [showModalClaim, setShowModalClaim] = useState(false) //this is used for the "claim date modal", shows up after clicking "continue"
  const [showModal, setShowModal] = useState(false); //this is used for the "recap modal", shows up at the confirmation of the order
  const [deliveryAddress, setDeliveryAddress] = useState(() => { return props.clientAddress });

  let total;
  //function called to close the offcanvas
  const handleClose = () => props.setShowBasket(false);

  //function called to close the end modal
  const handleCloseModal = () => {
    console.log("chiamata!")
    //clean up of everything:
    sessionStorage.removeItem("productList")
    setElements([])
    props.setDirtyAvailability(true)
  }


  //this use effect is used to update the basket!
  useEffect(() => {
    if (props.dirtyBasket) {
      if (sessionStorage.length > 0) {
        setElements(JSON.parse(sessionStorage.getItem("productList")))
      }
      props.setDirtyBasket(false);
    }
    // eslint-disable-next-line
  }, [props.dirtyBasket, props.setDirtyBasket])

  //this use effect does the cleanup if the date changes
  useEffect(() => {
    sessionStorage.removeItem("productList")
    setElements([])
  }, [props.date])

  //this is used to adjust the quantity if something is removed from the basket
  function handleClick(id, quantity) {
    if (sessionStorage.length > 0) {
      let list = JSON.parse(sessionStorage.getItem("productList"));
      let info = [id, quantity]
      list = list.filter((el) => el.productid !== id)
      sessionStorage.setItem("productList", JSON.stringify(list))
      props.setDirtyBasket(true)
      props.setDirtyQuantity(info)
    }
  }

  function getTotal() {
    if (sessionStorage.length > 0) {
      let list = JSON.parse(sessionStorage.getItem("productList"));
      let tot = parseFloat(list.reduce((partial_sum, product) => {
        return partial_sum + parseFloat(product.subtotal)
      }, 0)).toFixed(2)
      total = tot
    }
    return total
  }

  function checkAndOrder() {
    addPRequest(props.userId,
      props.date,
      dayjs(claimdate).format("YYYY-MM-DD HH:mm"),
      null,
      deliveryAddress,
      null,
      "pending",
      elements)
      .then(result => {
        if (result.status !== undefined && result.status === 406) {
          props.setMessage(["danger", result.listofProducts.map(x => x.name + " ").concat("are not available")])
        }
        else if (result.status !== undefined && result.status === 200) {
          props.setMessage(["success", "Order received!"])
          setShowModal(true);
        }
      }).catch(err => { props.setMessage(["danger", err.message]) })
      .finally(() => {
        props.setShowBasket(false)
      })

  }

  return (
    <>
      {showModalClaim &&
        <ModalClaimDate show={showModalClaim}
          setShow={setShowModalClaim}
          claimdate={claimdate}
          setClaimdate={setClaimdate}
          handleOrder={checkAndOrder}
          clientAddress={props.clientAddress}
          address={deliveryAddress}
          setAddress={setDeliveryAddress}
        />}

      {showModal &&
        <ModalEnd
          showModal={showModal} setShowModal={setShowModal}
          handleCloseModal={handleCloseModal}
          products={{ summary: elements, total: getTotal() }}
          setDirtyAvailability={props.setDirtyAvailability}
        />}

      <Offcanvas show={props.showBasket} placement="end" onHide={handleClose} {...props} style={{ "backgroundColor": "#FFF3E0", color: "#5E3A08" }}>
        <Offcanvas.Header closeButton className="">
          <Offcanvas.Title className="d-flex align-items-center" style={{ fontSize: "28px" }}>
            {cartFill} {'\u00A0'} This is your <strong>{'\u00A0'}basket</strong></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ maxHeight: "75vh" }}>
          <Offcanvas.Title style={{ fontSize: "30px", "fontWeight": "600" }}>Selected Items</Offcanvas.Title>
          {elements && elements.length > 0 ?
            <>
              <Table size="sm" className="mt-3" responsive>
                <tr className="mb-0" style={{ borderBottom: "2px solid black" }}>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </Table>
              <ListGroup variant="flush">
                {elements.map((el, index) => {
                  return (
                    <>
                      <Row key={index} className={index === 0 ? "basketRow" : "mt-2 basketRow"} style={{ borderBottom: "1px solid gray" }}>
                        <Row className="p-0 m-0 w-100">
                          <Col xs={5}>{el.name}</Col>
                          <Col style={{ paddingLeft: "0px" }}>{el.quantity} {el.measure} </Col>
                          <Col className="text-center">
                            <Button variant="flat" className="py-0 m-0" style={{ position: "relative", bottom: "0.2rem" }} onClick={() => { handleClick(el.productid, el.quantity) }}>{cross}</Button>
                          </Col>
                        </Row>
                        <Row className="m-0 p-0 " style={{ fontSize: "0.7rem" }}>
                          <span className="text-muted pb-1 p-0" style={{ position: "relative", left: "7rem", maxWidth: "8rem" }} > Subtotal: {parseFloat(el.subtotal).toFixed(2)} €</span>
                        </Row>
                      </Row>
                    </>
                  )
                })}
              </ListGroup>
            </>

            :
            <p className="mt-3">Your basket is currently empty.</p>
          }
          {elements && elements.length > 0 &&
            <Container className="fixed-bottom" style={{ position: "absolute", maxHeigh: "25vh" }}>
              <Row style={{ position: "relative", bottom: "3rem", left: "0.5rem" }} className="mb-3 division">
                <Col><strong>Total:</strong></Col>
                <Col md={{ span: 3, offset: 1 }} style={{ fontSize: "20px", paddingLeft: "0px" }}><strong>{getTotal()} €</strong></Col>
              </Row>
              <Button className="order-btn" style={{ position: "absolute", right: "10px", bottom: "10px" }}
                disabled={!(elements && elements.length > 0)} variant="yellow"
                onClick={() => setShowModalClaim(true)}>
                <span style={{ position: "relative", bottom: "0.1rem" }}>{coin}</span> Done!
              </Button>
            </Container>
          }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

