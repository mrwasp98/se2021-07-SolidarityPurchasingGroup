import { Container, Form, Button, Row, Col, Alert, Card, ButtonGroup, Table } from "react-bootstrap";
import { addShopEmployee, getUsernames, addClient, addFarmer } from "../API/API.js";
import { iconStar } from "./Icons";
import { Link } from "react-router-dom";
import React, { Component } from 'react';

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

class RegisterUser extends Component {

  state = {
    step: this.props.st,
    name: '',
    surname: '',
    username: '',
    password: '',
    cpassword: '',
    address: '',
    place: '',
    wallet: 0,
    type: this.props.type,
    error: false,
    messageError: '',
    inserted: false,
    usernames: []
  }

  submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
    } else {

      let valid = true;
  
      if (this.state.password !== this.state.cpassword) {
        valid = false;
        this.setState({ error: true })
        this.setState({ messageError: "Passwords are not equal" })
        console.log("Err");
      } else if (this.state.password === '' || this.state.password.length < 6 || isAlphaNumeric(this.state.password) === false) {
        valid = false;
        this.setState({ error: true })
        this.setState({ messageError: "The password must be at least 6 characters long and must contain both alphabetic and numerical values." })
      }

      this.state.usernames.map((us) => {
        if (us.username === this.state.username) {
          valid = false;
          this.setState({ messageError: "Username already used" });
          this.setState({ error: true });
          return;
        }
      });

      if (this.state.type === "shopemployee" && valid === true) {
        console.log("Shopp----");
        this.setState({ inserted: true });
        addShopEmployee(this.state.username, this.state.password).then(() => {
          this.setState({ inserted: true });
          this.setState({ error: false });
        });
      }

      if (this.state.type === "farmer" && valid === true) {
        addFarmer(this.state.username, this.state.password, this.state.name, this.state.surname, this.state.place, this.state.address).then(() => {
          this.setState({ inserted: true });
          this.setState({ error: false });
        });
      }

      if (this.state.type === "client" && valid === true) {
        addClient(this.state.name, this.state.surname, this.state.username, this.state.wallet, this.state.address, this.state.password, this.state.type).then(() => {
          this.setState({ inserted: true });
          this.setState({ error: false });
        });
      }
    }
  };

  componentDidMount() {
    getUsernames().then((users) => {
      this.setState({ usernames: users })
    })
  };

  nextStep = () => {
    const { step } = this.state
    this.setState({
      step: step + 1
    })
  }

  prevStep = () => {
    const { step } = this.state
    this.setState({
      step: step - 1
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { step, name, surname, username, password, cpassword, address, place, wallet, type } = this.state;
    const inputValues = { name, surname, username, password, cpassword, address, place, wallet, type };
    switch (step) {
      case 1:
        return <UserDetails
          nextStep={this.nextStep}
          handleChange={this.handleChange}
          inputValues={inputValues}
        />
      case 2:
        return <AddressDetails
          nextStep={this.nextStep}
          prevStep={this.prevStep}
          handleChange={this.handleChange}
          inputValues={inputValues}
        />
      case 3:
        return <Confirmation
          nextStep={this.nextStep}
          prevStep={this.prevStep}
          inputValues={inputValues}
          handleChange={this.handleChange}
          submit={this.submit}
          error={this.state.error}
          messageError={this.state.messageError}
          inserted={this.state.inserted}
        />
    }

  }
}

class UserDetails extends Component {

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  }

  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };


  render() {
    return (
      <Container className="justify-content-center">
        <Card className="mt-4">
          <Card.Header as="h5">Already in?</Card.Header>
          <Card.Body className="mb-2">
            <ButtonGroup vertical aria-label="Directions" className="d-flex" >
              <Button variant="yellow" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprodreq">
                <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/user/client/password" className="py-2 yellowLink">
                  Yes, create a new password
                </Link>
              </Button>
              <Button variant="yellow" className="mx-auto p-0 mb-4 py-2 yellowLink text-center" size="lg" id="toprodreq" onClick={this.saveAndContinue}>
                No, I'm new
              </Button>
              <Button variant="secondary" className="mx-auto d-flex p-0 mb-4" size="lg" id="toprodreq">
                <Link style={{ minWidth: "100%", textDecoration: "none" }} to="/user" className="py-2 greyLink">
                  Back to choices
                </Link>
              </Button>
            </ButtonGroup>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

class AddressDetails extends Component {

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  }

  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };


  render() {
    return (
      <>
        <Container className='login-form text-warning'>
          <Col>
            <h1 align="center">{iconStar}&nbsp;About you</h1>
            {""}
            <Form className="mt-5 ">
              <Table className="mb-3 color">
                <Form.Group as={Row} className="mb-3" controlId="formBasicName">
                  <Row md={3}>
                    <Form.Label className='text-warning myText' column sm="2">
                      Name:
                    </Form.Label>
                    <Col sm="10" md={8}>
                      <Form.Control
                        placeholder="Name"
                        type="text"
                        name="name"
                        required
                        onChange={this.props.handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formBasicSurname">
                  <Row md={3}>
                    <Form.Label className='text-warning myText' column sm="2">
                      Surname:
                    </Form.Label>
                    <Col sm="10" md={8}>
                      <Form.Control
                        placeholder="Surname"
                        type="text"
                        name="surname"
                        required
                        onChange={this.props.handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {(this.props.inputValues.type === "farmer") ?
                  <Form.Group as={Row} className="mb-3" controlId="formBasicPlace">
                    <Row md={3}>
                      <Form.Label className='text-warning myText' column sm="2">
                        Place:
                      </Form.Label>
                      <Col sm="10" md={8}>
                        <Form.Control
                          placeholder="Place"
                          type="text"
                          name="place"
                          required
                          onChange={this.props.handleChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                  :
                  <>
                  </>
                }

                <Form.Group as={Row} className="mb-3" controlId="formBasicAddress">
                  <Row md={3}>
                    <Form.Label className='text-warning myText' column sm="2">
                      Address:
                    </Form.Label>
                    <Col sm="10" md={8}>
                      <Form.Control
                        placeholder="Address"
                        type="text"
                        name="address"
                        required
                        onChange={this.props.handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Table>
              {(this.props.inputValues.type === "client") ?
                <Container className="d-flex justify-content-between my-4">
                  <Button variant="secondary" className="mb-2 text-white loginbutton" onClick={this.back}>Back</Button>
                  <Button type='submit' variant='warning' className="cartButton mb-2 text-white loginbutton" onClick={this.saveAndContinue}>Next</Button>
                </Container>
                :
                <Container className="d-flex justify-content-between my-4">
                  <Link  to="/user">
                    <Button type='submit' variant='secondary' className="mb-2 text-white loginbutton">Back</Button>
                  </Link>
                  <Button type='submit' variant='warning' className="cartButton mb-2 text-white loginbutton" onClick={this.saveAndContinue}>Next</Button>
                </Container>
              }
              {' '}
            </Form>
          </Col>
        </Container>
      </>
    );
  }
}
class Confirmation extends Component {

  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  }

  saveAndContinue = (e) => {
    e.preventDefault();
    this.props.nextStep();
  };

  render() {
    const { inputValues: { name, surname, username, password, cpassword, address, place, wallet, type } } = this.props;

    return (
      <Container className='login-form text-warning'>
        <Col>
          <h2 align="center">{iconStar}&nbsp;Confirm</h2>
          {" "}
          {this.props.inserted ? (
            <Alert className="alert-success" key={155} variant={"success"}>
              The user has been created
            </Alert>
          ) : (
            ""
          )}
          {" "}
          {this.props.error ? (
            <Alert className="alert-danger" key={156} variant={"danger"}>
              {this.props.messageError}
            </Alert>
          ) : (
            ""
          )}
          {/*(this.props.inputValues.type === "client" || this.props.inputValues.type === "farmer") ?
            <Row className=" justify-content-center">
              <Table className="mb-3 color">
                <Col md={8}>
                  <p className='text-warning myText'>Name: {name}</p>
                  <p className='text-warning myText'>Surname: {surname}</p>
                  {(this.props.inputValues.type === "client") ?
                    <p className='text-warning myText'>Wallet: {wallet}</p>
                    :
                    <p className='text-warning myText'>Place: {place}</p>
                  }
                  <p className='text-warning myText'> Adress: {address}</p>
                </Col>
              </Table>
            </Row>
            :
            <>
            </>
                */}
          <Form className="mt-5 " onSubmit={(event) => this.props.submit(event)}>
            <Table className="mb-3 color">
              <Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
                <Row md={3}>
                  <Form.Label className='text-warning myText' column sm="2">
                    Username:
                  </Form.Label>
                  <Col sm="10" md={8}>
                    <Form.Control
                      placeholder="Username"
                      type="text"
                      name="username"
                      required
                      onChange={this.props.handleChange}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                <Row md={3}>
                  <Form.Label className='text-warning myText' column sm="2">
                    Choose password:
                  </Form.Label>
                  <Col sm="10" md={8}>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      name="password"
                      required
                      onChange={this.props.handleChange}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formBasicCPassword">
                <Row md={3}>
                  <Form.Label className='text-warning myText' column sm="2">
                    Confirm password:
                  </Form.Label>
                  <Col sm="10" md={8}>
                    <Form.Control
                      placeholder="Password"
                      type="password"
                      name="cpassword"
                      required
                      onChange={this.props.handleChange}
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Table>


            {(this.props.inputValues.type === "client" || this.props.inputValues.type === "farmer") ?
              <Container className="d-flex justify-content-between my-4">
                <Button variant="secondary" className="mb-2 text-white loginbutton" onClick={this.back}>Back</Button>
                <Button type='submit' variant='warning' className="cartButton mb-2 text-white loginbutton">Confirm</Button>
              </Container>
              :
              <Container className="d-flex justify-content-between my-4">
                <Link  to="/user">
                  <Button type='submit' variant='secondary' className="mb-2 text-white loginbutton">Back</Button>
                </Link>
                <Button type='submit' variant='warning' className="cartButton mb-2 text-white loginbutton">Confirm</Button>
              </Container>
            }
            {' '}
          </Form>
        </Col>
      </Container>
    )
  }
}

export default RegisterUser;