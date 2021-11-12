import {Alert, Button, Form, Container, Col} from 'react-bootstrap';
import {useState} from 'react';
import '../App.css';

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

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);

    const [show, setShow] = useState(false);

    const doLogIn = async (credentials) => {
        try {
            console.log('entra');
            const user = await props.login(credentials);
            props.setLogged(true);
            props.setUser(user);
        } catch (err) {
            setError('Wrong email or password! Try again');
            setShow(true);
        }
    }

    const handleSubmit = (event) => {
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

            if (username === '' || password === '' || password.length < 6 || isAlphaNumeric(password) === false) {
                valid = false;
                setShow(true);
            } else {
                valid = true;
            }
            if (valid) {
                console.log(credentials);
                doLogIn(credentials);

            }
        }
    };

    return (
        <>
            <Container className='login-form'>
                <Col>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <h2 className="text-warning">Login</h2>
                        <Form.Group controlId='email'>
                            <Form.Label className='text-warning myText'>Email</Form.Label>
                            <Form.Control required type="text" placeholder="Insert your email" onChange={ev => { setUsername(ev.target.value); setShow(false) }}/>
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label className='text-warning myText'>Password</Form.Label>
                            <Form.Control required type="password" placeholder='Insert your password' onChange={(ev) => { setPassword(ev.target.value); setShow(false) }}/>
                        </Form.Group>

                        {show ? <Alert variant='danger' className='error-box' onClose={() => (setShow(false))} dismissible>
                            <Alert.Heading>{error}</Alert.Heading>
                            <p>The password must be at least 6 characters long and must contain both alphabetical and numerical values.</p>
                        </Alert>
                        : ''}

                        <Button type='submit' variant='warning' className='loginButton'>Login</Button>

                    </Form>
                </Col>
            </Container>
        </>
    )
}

export { LoginForm };