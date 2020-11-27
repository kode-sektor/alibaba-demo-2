import React from 'react'
import Layout from '../../components/Layout/index'
import { Jumbotron } from 'react-bootstrap'
import './style.css';

const Home = () => {
    return (
        <Layout>
            <Jumbotron className="text-center" style={{margin : '5rem', background : '#fff'}}>
                <h1>Welcome to Admin Dashboard  </h1>
            </Jumbotron>
        </Layout>
    )
}

export default Home
