import dayjs from 'dayjs';
import React from 'react';
import {Container, Alert } from "react-bootstrap";

export default function WarehouseHome(props) {
    // eslint-disable-next-line
    const {date, username} = props

    const reportVisible = 
    dayjs(date).format('dddd') !== 'Sunday' || 
    (dayjs(date).format('dddd') === 'Saturday' && dayjs(date).format('H') < 9) || 
    (dayjs(date).format('dddd') === 'Monday' && dayjs(date).format > 9) ? true : false

    return(
        <Container>
            <h1>Hi warehouse manager</h1>
            {reportVisible ? <p>You can will see the delivery</p>
            
        
            :
            <Alert>
                <Alert.Heading>You cannot see still the delivery</Alert.Heading>
                <p>From Monday by 9:00 you can see delivery for each farmer</p>
            </Alert>
        
        
            }
        </Container>
    );
}