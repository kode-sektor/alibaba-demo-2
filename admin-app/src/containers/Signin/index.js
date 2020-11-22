import React from 'react'
import { Container, Form, Row, Col, Button} from 'react-bootstrap'
import Layout from '../../components/Layout/index'

import Input from '../../components/UI/Input'

const Home = () => {
    return (
        <Layout>
            <Container>
                <Row style={{marginTop : '50px'}}>
                    <Col md={{span : 6, offset : 3}}>
                        <Form>
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

export default Home
