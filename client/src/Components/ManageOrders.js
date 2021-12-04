import { useEffect, useState } from "react";
import { } from "react-bootstrap";
import React from 'react'
import Select from 'react-select'
import { getOrdersByStatus } from "../API/API"
import HomeButton from "./HomeButton";
import { } from "./Icons";

export default function ManageOrders(props) {
    const [oldLength, setOldLength] = useState(0); //metodo che fa acqua, da aggiornare quando gli ordini canceled possono essere rimossi
    useEffect(() => {
        if (oldLength == 0 || props.failedOrders.length != oldLength) {
            getOrdersByStatus("pending") //da cambiare in ....
                .then((orders) => { props.setFailedOrders(orders); console.log(orders); setOldLength(orders.length) }); //deve essere cambiato nella giusta dicitura , es "canceled"
        }
    }, [props.failedOrders]);

    return (
        <>

        </>
    );
}