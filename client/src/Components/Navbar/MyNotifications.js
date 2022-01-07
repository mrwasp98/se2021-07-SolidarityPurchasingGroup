import { bell } from "../Utilities/Icons";
import { Button, Toast } from "react-bootstrap";
import { useState, useEffect } from "react";

export default function MyNotifications(props) {
  const [showB, setShowB] = useState(false);
  const toggleShowB = () => setShowB(!showB);
  const [message, setMessage] = useState("There isn't any unread message");

  useEffect(() => {
    if(props.message.topUpWallet && props.message.missed_pickups < 3)
      setMessage("Please add money in your wallet!");
    if(!props.message.topUpWallet && (props.message.missed_pickups > 2 && props.message.missed_pickups < 5))
      setMessage(`You have to take ${props.message.missed_pickups} orders!`);
    if(props.message.topUpWallet && (props.message.missed_pickups > 2 && props.message.missed_pickups < 5))
      setMessage("- Please add money in your wallet!" + `You have to take ${props.message.missed_pickups} orders!`);
    if((props.message.topUpWallet && props.message.missed_pickups == 5))
      setMessage("- Please add money in your wallet!" + `You are banned`);
    if(!props.message.topUpWallet && props.message.missed_pickups == 5)
      setMessage(`You are banned`);
  }, []);

  return (
    <>
      <Button onClick={toggleShowB} className="">{bell}</Button>
      <Toast
        onClose={toggleShowB}
        show={showB}
        animation={false}
        className="mynotify mt-3"
      >
        <Toast.Header>
          <strong className="me-auto">Notifications</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </>
  );
}