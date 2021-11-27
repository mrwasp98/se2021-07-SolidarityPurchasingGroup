import { bell } from "./Icons";
import { Button, Toast } from "react-bootstrap";
import { useState } from "react";

export default function MyNotifications(props) {
  const [showB, setShowB] = useState(false);
  const toggleShowB = () => setShowB(!showB);

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
        <Toast.Body>{props.message}</Toast.Body>
      </Toast>
    </>
  );
}
