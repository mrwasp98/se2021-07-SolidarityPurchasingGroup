/*
This component is used to let the client choose time and date for the pickup
*/
import { Form, Button, Modal, Row, Col, Container, } from "react-bootstrap";
import { useState, } from "react";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

export default function ModalClaimDate(props) {
    const handleClose = () => {
        if(!(props.claimdate.getDay() ==0 ||props.claimdate.getDay() ==1 ||props.claimdate.getDay() ==2|| props.claimdate.getDay() ==6 )){
            props.handleOrder()
            props.setShow(false)
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
        end.setHours(21, 0, 0)

        return start.getTime() < selectedDate.getTime() && end.getTime() > selectedDate.getTime()
    };


    return (
        <>
            <Modal show={props.show} onHide={handleClose} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Please, select date and time to pick up your order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        Remember, pickups take place from
                        <strong> Wednesday morning (09:00) </strong>
                        until
                        <strong> Friday evening (21:00)</strong>
                        .
                    </div>
                    <Row className="text-center mt-3 mb-2 ">
                        <DatePicker
                            selected={props.claimdate}
                            onChange={(date) => props.setClaimdate(date)}
                            filterDate={notSelectableDates}
                            filterTime={notSelectableTimes}
                            dateFormat="dd-mm-yyyy HH:mm"
                            showTimeSelect
                            timeFormat="HH:mm"
                        />
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Col>
                        {/* <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button> */}
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleClose}
                        disabled={props.claimdate.getDay() ==0 ||props.claimdate.getDay() ==1 ||props.claimdate.getDay() ==2|| props.claimdate.getDay() ==6}
                        >Check and Order</Button>
                    </Col>
                </Modal.Footer>
            </Modal>
        </>
    );
}