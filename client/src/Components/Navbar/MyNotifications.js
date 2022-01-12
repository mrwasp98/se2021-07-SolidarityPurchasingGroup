import { bell } from "../Utilities/Icons";
import { Button, Toast, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getSuspendedDate } from '../../API/API';
import dayjs from 'dayjs';


export default function MyNotifications(props) {
  const [showB, setShowB] = useState(false);
  const toggleShowB = () => setShowB(!showB);
  const [message, setMessage] = useState("There isn't any unread message");

  useEffect(() => {
    async function f() {
      const suspended = await getSuspendedDate(props.user);
      if (props.message.topUpWallet && props.message.missed_pickups < 3)
        setMessage("Please add money in your wallet!");
      if (props.message.topUpWallet === false && (props.message.missed_pickups > 2 && props.message.missed_pickups < 5))
        setMessage(`You have to take ${props.message.missed_pickups} orders!`);
      if (props.message.topUpWallet && (props.message.missed_pickups > 2 && props.message.missed_pickups < 5))
        setMessage(`Please add money in your wallet! -You have to take ${props.message.missed_pickups} orders!`);
      if (props.message.topUpWallet && props.message.missed_pickups === 0 && (suspended.suspended != undefined && dayjs(props.date).isBefore(suspended.suspended)))
        setMessage(`Please add money in your wallet! -You are banned!!`);
      if (!props.message.topUpWallet && props.message.missed_pickups === 0 && (suspended.suspended != undefined && dayjs(props.date).isBefore(suspended.suspended)))
        setMessage(`You are banned`);
    }
    if (props.logged === 'client')
      f()

  }, [props.user, props.message]);

  return (
    <>
      <Button onClick={toggleShowB} className="">{bell}</Button>
      <Toast
        onClose={() => {
          toggleShowB()
          props.setDismiss(true);
          if(props.logged === 'warehouse')
            props.setFarmers([])            
        }}
        show={showB}
        animation={false}
        className="mynotify mt-3"
      >
        <Toast.Header>
          <strong className="me-auto">Notifications</strong>
        </Toast.Header>
        {props.logged === 'client' ?
          <Toast.Body style={{ color: 'black' }} className="m-2">{message.split('-').map((m,index) => <Card key={"client-" + index + "-notification"} className='p-1 m-1' bg="warning">{m}</Card>)}</Toast.Body>
          :
          <Toast.Body style={{ color: 'black' }} className="m-2">{props.farmers.map((f,index) => <Card key={"warehouse-" + index + "-notification"} className='p-1 m-1' bg="warning">{f + " shipped orders of this week"}</Card>)}</Toast.Body>
        }
      </Toast>
    </>
  );
}