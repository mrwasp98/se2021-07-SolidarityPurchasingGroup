import { useHistory } from 'react-router-dom';

import { Button} from "react-bootstrap";
import { home } from "./Icons";


export default function HomeButton() {
    const history = useHistory();

    return (
        <Button
            className='position-fixed rounded-circle d-none d-md-block'
            style={{ width: '4rem', height: '4rem', bottom: '3rem', right: '3rem', zIndex: '100', "backgroundColor": "#143642", color: "white" }}
            onClick={() => history.push("/employeehome")}>
            {home}
        </Button>
    )
}