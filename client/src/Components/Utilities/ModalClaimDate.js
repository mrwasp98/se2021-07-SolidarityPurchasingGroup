/*
This component is used to let the client choose time and date for the pickup
*/
import { Form, ListGroup, Button, Modal, Col } from "react-bootstrap";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ModalClaimDate(props) {
  const [orderMethod, setOrderMethod] = useState("store");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleClose = () => {
    if (!(props.claimdate.getDay() === 0 ||props.claimdate.getDay() === 1 
    ||props.claimdate.getDay() === 2 ||props.claimdate.getDay() === 6)) {
      props.handleOrder();
      props.setShow(false);
    }
  };

  const notSelectableDates = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 1 && day !== 2 && day !== 6;
  };

  const notSelectableTimes = (time) => {
    const start = new Date(time);
    const end = new Date(time);
    const selectedDate = new Date(time);

    start.setHours(9, 0, 0);
    end.setHours(21, 0, 0);

    return (
      start.getTime() < selectedDate.getTime() &&
      end.getTime() > selectedDate.getTime()
    );
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={()=>{props.setShow(false);}}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Please, select date and time to pick up your order
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Remember, pickups take place from
            <strong> Wednesday morning (09:00) </strong>
            until
            <strong> Friday evening (21:00)</strong>.
          </div>
          <ListGroup className="mt-2">
            <ListGroup.Item>
              <Form>
                <Form.Check
                  inline
                  defaultChecked
                  className="m-3 "
                  type="radio"
                  name="ordergroup"
                  id="checkstore"
                  label="Pickup in store"
                  onClick={() => setOrderMethod(() => "store")}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="ordergroup"
                  id="checkdelivery"
                  label="Deliver to address"
                  onClick={() => setOrderMethod(() => "address")}
                />
              </Form>
            </ListGroup.Item>
            <ListGroup.Item
              variant="primary"
              className="d-flex w-100 justify-content-center align-items-center"
            >
              <Form>
                {orderMethod === "address" && (
                  <>
                    <Form.Check
                      defaultChecked
                      type="radio"
                      name="addressgroup"
                      id="checkdefadd"
                      label="Default address"
                      onClick={() => {
                        props.setAddress(() => { return props.clientAddress });
                        setShowAddressForm(() => false);
                      }}
                    />
                    <Form.Label className="mt-1 mb-3">
                      Address: {props.clientAddress}
                    </Form.Label>
                    <Form.Check
                      type="radio"
                      name="addressgroup"
                      id="checkspec"
                      label=" Other address"
                      onClick={() => {
                        setShowAddressForm(() => true);
                      }}
                    />{" "}
                  </>
                )}
                {orderMethod === "address" && showAddressForm && (
                  <>
                    <Form.Label className="mt-1">Add new address:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Write your delivery address"
                      onChange={(e) => props.setAddress(() => e.target.value)}
                    />
                  </>
                )}

                <Form.Label
                  inline
                  className={orderMethod === "store" ? "mt-0" : "mt-3"}
                >
                  Choose time for delivery:
                </Form.Label>
                <DatePicker
                  selected={props.date}
                  onChange={(date) => props.setClaimdate(date)}
                  filterDate={notSelectableDates}
                  filterTime={notSelectableTimes}
                  dateFormat="dd-MM-yyyy HH:mm"
                  showTimeSelect
                  timeFormat="HH:mm"
                  minDate={props.date}
                />
              </Form>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Col>
            {/* <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button> */}
          </Col>
          <Col className="d-flex justify-content-end">
            <Button
              variant="primary"
              onClick={handleClose}
              disabled={
                props.claimdate.getDay() === 0 ||
                props.claimdate.getDay() === 1 ||
                props.claimdate.getDay() === 2 ||
                props.claimdate.getDay() === 6
              }
            >
              Check and Order
            </Button>
          </Col>
        </Modal.Footer>
      </Modal>
    </>
  );
}
