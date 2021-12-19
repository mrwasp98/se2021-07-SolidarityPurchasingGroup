import {useState, Fragment} from 'react'
import {Alert, Form, Button, Container, Row, Col, Card} from 'react-bootstrap';
import {Link, Redirect, useLocation} from 'react-router-dom';
import axios from 'axios';

export default function ProductForm(props){
    const location = useLocation();
    const path = location.pathname;
    const id = location.state ? location.state.id : 0;
    const [name, setName] = useState(location.state ? location.state.name : '');
    const [description, setDescription] = useState(location.state ? location.state.description : '');
    // eslint-disable-next-line
    const [farmerid, setFarmerid] = useState(location.state ? location.state.farmerid : props.userId);
    const [measure, setMeasure] = useState(location.state ? location.state.measure : '');
    const [category, setCategory] = useState(location.state ? location.state.category : '');  
    const [typeofproduction, setTypeofproduction] = useState(location.state ? location.state.typeofproduction : '');  
    const [picture, setPicture] = useState(location.state ? location.state.picture : '')
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('') ;
    // eslint-disable-next-line
    const [file, setFile] = useState(); //file image before uploaded

    let image = ''; //copy of the file


    const addImage = async () => {
        const data = new FormData();
        data.append('file', image);
        setFile(data);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const url = 'http://localhost:3001/api/img'
        axios.post(url, data, config).then((response) => {
            alert('Image uploaded successfully');
            setPicture("/img/" + image.name);
        }).catch(err => {console.log(err)})
      }


    const deleteImage = async () => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const url = 'http://localhost:3001/api'
        axios.delete(url+picture, config).then((response) => {
            setPicture('');
        }).catch(err => {console.log(err)})
      }

    //on change dell'input
    const browse = (event) =>{
        //when i select an image and another image is just uploaded, i delete the image uploaded before
        if(picture !== ' '){
            deleteImage().then(()=>{
                image = event.target.files[0];
                addImage();
            })
        } else{
            image = event.target.files[0];
            addImage();
        }

    };

    const submit = (e) => {
        e.preventDefault();
        const product = {id:id, name: name, description: description, farmerid: farmerid, measure: measure, category: category, typeofproduction: typeofproduction, picture: picture};
        let valid = true;

        if(name === '' || description === ''){
            valid = false;    
            setErrorMessage("Name or description are empty");
            setSubmitted(false);
        } else if(category === undefined){
            valid=false;
            setErrorMessage("Select at least one type of production");
            setSubmitted(false)
        } else if(picture === ''){
            valid=false;
            setErrorMessage("Select an image for your product");
            setSubmitted(false)
        }

        if(valid === true){
            if(path === '/addProduct'){
                props.addProduct(product); 
                setSubmitted(true);
            }
            if(path === '/editProduct'){
                props.editProduct(product);
                setSubmitted(true);
            }
        }
    }

    return( <>{submitted ?  <Redirect to="/farmerhome"/> :
        <Container fluid="md">
            <h1>Edit your product</h1>
            <hr></hr>
            <Form onSubmit={submit}>
            <Form.Group controlId="formProduct">
                <Form.Label style={{marginTop: "10px"}}>Name</Form.Label>
                <Form.Control type="name" placeholder="Enter name" onChange={(e) => setName(e.target.value)} value={name} className="productName"/>
                <Form.Label style={{marginTop: "30px"}}>Description</Form.Label>
                <Form.Control as="textarea" placeholder="Enter description" rows={3} onChange={(e) => setDescription(e.target.value)} className="productDescr" value={description}/>
                <Row>
                    <Col>
                    <Form.Label style={{marginTop: "30px"}}>Category</Form.Label>
                        <Form.Select aria-label="Select category" className="productCategory" defaultValue={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Choose..." selected hidden>Choose...</option>
                            <option value="Meat and Cold Cuts">Meat and Cold Cuts</option>
                            <option value="Fruit and Vegetables">Fruit and Vegetables</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Bread and Sweets">Bread and Sweets</option>
                        </Form.Select>
                    </Col>
                    <Col>
                    <Form.Label style={{marginTop: "30px"}}>Type of production</Form.Label>
                        <Form.Select aria-label="Select category" className="productProduction" defaultValue={typeofproduction} onChange={(e) => setTypeofproduction(e.target.value)}>
                            <option value="Choose..." selected hidden>Choose...</option>
                            <option value="Biological agriculture">Biological agriculture</option>
                            <option value="Local farm">Local farm</option>
                            <option value="Sustainable">Sustainable</option>
                            <option value="Zero Kilometer">Zero Kilometer</option>
                        </Form.Select>
                    </Col>
                    <Col>
                    <fieldset>
                        <Form.Group as={Row} className="mt-4">
                        <Form.Label as="legend" column>
                            Measure
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Check
                            type="radio"
                            label="Kg"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios1"
                            checked={measure === 'kg'}
                            onChange={(e) => {
                                setMeasure(e.target.value ? "kg" : "unit")
                            }}
                            />
                            <Form.Check
                            type="radio"
                            label="Unit"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios2"
                            checked={measure === 'unit'}
                            onChange={(e) => setMeasure(e.target.value ? "unit" : "false")}
                            />
                        </Col>
                        </Form.Group>
                    </fieldset>
                    </Col>
                </Row>
                <hr></hr>
                <Row>
                    <Col>
                    <h5>Here you can upload the image of your product</h5>
                    <span id="vuoto" className="collapse small text-danger">Non hai selezionato nessun file</span>
                    <span id="formato" className="collapse small text-danger">Puoi caricare solo jpeg o png.</span>
                    <label for="file" className="btn btn-outline-primary btn-block mt-4">Select Image</label>
                    <input id="file" type="file" style={{visibility: "hidden"}}  lang="en" multiple onChange={browse}/>
                    </Col>
                     <Col>
                        <Card style={{width: "50%"}} className="p-3">
                        {(picture === '') &&<h5>Your image will appear here</h5>}
                        {(picture !== '') && <><Card.Img  src={picture}></Card.Img>
                        <Button id="productform_delete" variant="danger" onClick={deleteImage} className='mt-2'>Delete image</Button></> }             
                        </Card>
                     </Col>               
                </Row>
                {errorMessage && <Alert className="mt-3" variant='danger'>{errorMessage}</Alert>}
            </Form.Group>
            <div className="d-flex justify-content-between mb-4 mt-4">
                <Link to="/farmerhome"><Button id="productform_cancel" variant='danger'>Cancel</Button></Link>
                <Button id="productform_save"variant="yellow" onClick={submit}>Save</Button> 
            </div>
            </Form>
        </Container>
    }</>

    )

}
