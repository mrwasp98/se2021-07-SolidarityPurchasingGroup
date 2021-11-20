import { useHistory } from 'react-router-dom';

import { Button, InputGroup} from "react-bootstrap";
import { home } from "./Icons";


export default function HomeButton(props) {
    const history = useHistory();

    const handleclick = ()=>{
        console.log("chiamata")
        console.log(props.IsLogin)
        if(props.IsLogin === "shopemployee"){
            history.push("/employeehome")
        }else if(props.IsLogin === "client"){
            history.push("/clienthome")
        }
    }


    return (
        <Button
            className='position-fixed rounded-circle d-none d-md-block'
            style={{ width: '4rem', height: '4rem', bottom: '3rem', right: '3rem', zIndex: '100', "backgroundColor": "#143642", color: "white" }}
            onClick={() => handleclick()}>
            {home}
        </Button>
    )
}