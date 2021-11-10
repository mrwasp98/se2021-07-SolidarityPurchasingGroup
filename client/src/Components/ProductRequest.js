import { Card, Container, Form, Table, ListGroup, ListGroupItem, Button, Row, Col} from "react-bootstrap";
import { useEffect, useState } from "react";
import { getClients } from "../API/API"
import Select from 'react-select'
import { iconAdd } from "./Icons";

function ProductLine(props){

    useEffect(() => {
        //API get availability
    }, []);

    return( <tr>
                <td>{props.product.name}</td>
                <td>{props.product.category}</td>
                <td>to define</td>
                <td><span style={{cursor: 'pointer'}}>{iconAdd}</span>&nbsp;</td>
            </tr>
)

}

export default function ProductRequest(props){

    const [selectedClient, setSelectedClient] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        getClients()
            .then((res) => {
                props.setClients(res)
                setOptions(props.clients.map((e) => { return { value: e.userid, label: e.name + " " + e.surname + " - " + e.address } }))
            })
    }, []);

    return(<>
        <Container className="justify-content-center mt-3">
            <h1>Enter a new product request</h1>
            <Card className="text-left mt-4">
            <ListGroup className="list-group-flush">
                    <ListGroupItem className="p-0">
                        <Card.Header>
                            First, select <b>the client</b>.
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Select options={options} onChange={(event) => setSelectedClient(event.value)} />
                            </Form>
                        </Card.Body>
                    </ListGroupItem>
                    </ListGroup>
                    </Card>

                    {selectedClient &&
                        <>
                            <Table className="mt-3" striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Product</th>
                                    <th>Variuos info</th>
                                    <th>Quantity</th>
                                    <th>Add to order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {props.products.map(p => <ProductLine product={p}></ProductLine>)}
                                </tbody>    
                            </Table>
                            <div className="d-flex justify-content-between">
                                <Button variant="danger">Back</Button>
                                <Button>Check and order</Button>
                            </div>
                        </>
                    }
        </Container>
    </>)
}