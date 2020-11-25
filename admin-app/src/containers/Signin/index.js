import React from 'react'
import { Container, Form, Row, Col, Button} from 'react-bootstrap'
import Layout from '../../components/Layout/index'
import Input from '../../components/UI/Input'

import {login} from '../../actions' // redux
import {useDispatch} from 'react-redux'

const Signin = () => {

    const dispatch = useDispatch()

    const userLogin = (e) => {
        e.preventDefault()

        const user = {
            email : 'kodesektor@gmail.com',
            password : '123456'
        }

        // Function name must be the same name as found in the 
        // ../../actions/index.js file ('login')
        dispatch(login (user))  
    }

    return (
        <Layout>
            <Container>
                <Row style={{marginTop : '50px'}}>
                    <Col md={{span : 6, offset : 3}}>
                        <Form onSubmit={userLogin}>
                            <Input 
                                label="Email"
                                placeholder="Email"
                                value=""
                                type="email"
                                onChange={() => {}}
                            />
                            <Input 
                                label="Password"
                                placeholder="Password"
                                value=""
                                type="password"
                                onChange={() => {}}
                            />
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Layout>
    )
}

export default Signin
