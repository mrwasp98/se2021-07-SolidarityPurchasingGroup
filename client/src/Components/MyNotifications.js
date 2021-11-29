import { bell } from "./Icons";
import { Button, Toast } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";

export default function MyNotifications(props) {
  const [showB, setShowB] = useState(false);
  const toggleShowB = () => setShowB(!showB);
  const [message,setMessage]=useState("There isn't any unread message");

  useEffect(() => {
    console.log("props.message.topUpWallet");
    console.log(props.message.topUpWallet);
    if(props.message.topUpWallet)
      setMessage("Please add money in your wallet!");
  }, []);

  return (
    <>
      <Button onClick={toggleShowB}>{bell}</Button>
      <Toast
        onClose={toggleShowB}
        show={showB}
        animation={false}
        className="position-absolute mynotify"
      >
        <Toast.Header>
          <strong className="me-auto">Notifications</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </>
  );
}
