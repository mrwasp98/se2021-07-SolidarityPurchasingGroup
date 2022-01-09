import {Alert, Button, Form, Container, Col, Table} from 'react-bootstrap';
import { iconStar } from "./Utilities/Icons";
import {useState} from 'react';
import '../App.css';
import { useHistory } from 'react-router-dom';

//This function verify if a string contains both numeric and alphabetic caracthers
function isAlphaNumeric(str) {
    var code, i, len, nNum = 0, nLett = 0;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (code > 47 && code < 58) {
            nNum++;
        }
        if ((code > 64 && code < 91) || (code > 96 && code < 123)) {
            nLett++;
        }
    }
    if (nNum === 0 || nLett === 0) {
        return false;
    }
    return true;
};

function LoginForm(props) {
    const history = useHistory()

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);

    const [show, setShow] = useState(false);

    const doLogIn = async (credentials) => {
      props.login(credentials)
      .then((user)=>{
        props.setLogged(user.type);
        props.setUser(user.username);
        props.setUserId(user.id);
        //Depending on who is logging in he is redirect to a different page
        if(user.type === "shopemployee"){
            if(props.wallet){
                history.push("/wallet/0")
            } else {
                history.push("/employeehome")
            }
        }else if(user.type === "warehouse"){
            history.push("/warehousehome")
        }else if(user.type === "client"){
            history.push("/products")
        }else if(user.type === "farmer"){
            history.push("/farmerhome")  //this if is used to story9
        }else if(user.type === "manager"){
            history.push("/managerhome")
        }
      })
        .catch (err=>{
            setError('Wrong email or password! Try again');
            setShow(true);
        })
    }

    const handleSubmit = async (event) => {
        if (event.currentTarget.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        }

        if (event.currentTarget.checkValidity() === true) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(false);

            const credentials = { username: username, password: password };

            var valid;

            //Check if the password has the correct format and if the username is not empty!
            //If everything is ok the login is performed
            if (username === '' || password === '' || password.length < 6 || isAlphaNumeric(password) === false) {
                valid = false;
                setError('The password must be at least 6 characters long and must contain both alphabetical and numerical values.')
                setShow(true);
            } else {
                valid = true;
            }
            
            if (valid) {
                doLogIn(credentials);
            }
        }
    };

    return (
        <div className="form_wrapper">
            <Container className='login-form text-warning'>
                <Col className="col">
                  <h2 align="center">{iconStar}&nbsp;Login</h2>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Table className="mb-3 color">
                            <Form.Group className="m-3 emailfield" controlId='email'>
                                <Form.Label className='text-warning myText'>Email</Form.Label>
                                <Form.Control required type="email" placeholder="Insert your username" onChange={ev => { setUsername(ev.target.value); setShow(false) }}/>
                                <Form.Control.Feedback type="invalid">
                                    Please insert a valid email.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="m-3 " controlId='password'>
                                <Form.Label className='text-warning myText'>Password</Form.Label>
                                <Form.Control required type="password" className="passwordfield" placeholder='Insert your password' onChange={(ev) => { setPassword(ev.target.value); setShow(false) }}/>
                            </Form.Group>
                            {show ? <Alert variant='danger' className='error-box' onClose={() => (setShow(false))} dismissible>
                                <Alert.Heading>{error}</Alert.Heading>
                            </Alert>
                            : ''}
                        </Table>
                        <Container className="d-flex justify-content-end">
                            <Button type='submit' variant='warning' className="cartButton mb-2 text-white loginbutton">Login</Button>
                        </Container>
                    </Form>
                </Col>
            </Container>
        </div>
    )
}

export { LoginForm };