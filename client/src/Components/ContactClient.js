import { Button } from "react-bootstrap";
import { contact } from "./Icons";

export default function ContactClient(props) {
    return ( 
        <Button
            className='contactButton'>
            {contact} Contact Client
        </Button>
    )
}