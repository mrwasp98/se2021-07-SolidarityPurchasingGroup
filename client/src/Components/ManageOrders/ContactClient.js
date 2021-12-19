import { Button } from "react-bootstrap";
import { contact } from "../Utilities/Icons";

export default function ContactClient(props) {
    return ( 
        <Button
            className="contactButton" style={{"font-size":"17px"}}>
            {contact} Contact Client
        </Button>
    )
}