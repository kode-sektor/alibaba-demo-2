import React from 'react'
import Layout from '../../components/Layout/index'
import { Jumbotron } from 'react-bootstrap'

const Home = () => {
    return (
        <Layout>
            <Jumbotron className="text-center">
                <h1>Welcome to Admin Dashboard  </h1>
            </Jumbotron>
        </Layout>
    )
}

export default Home
