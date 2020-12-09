import React, {useEffect} from "react";
import { useDispatch } from 'react-redux'
import { getProductsBySlug } from '../../actions/'

import Layout from "../../components/Layout";
// import getParams from "../../utils/getParams";
// import ClothingAndAccessories from "./ClothingAndAccessories";
// import ProductPage from "./ProductPage";
// import ProductStore from "./ProductStore";
import "./style.css";


const ProductListPage = (props) => {

    // You are not passing props from another component
    // But you need it anyways just to fetch slug off it
    console.log(props)
    const dispatch = useDispatch()

    useEffect (() => {
        const { match } = props 
        dispatch(getProductsBySlug(match.params.slug))
    }, [])

    // const renderProduct = () => {
        
    //     console.log(props);

        // const params = getParams(props.location.search);
    //     let content = null;

    //     switch (params.type) {

    //         case "store":
    //             content = <ProductStore {...props} />;
    //         break;
    //         case "page":
    //             content = <ProductPage {...props} />;
    //         break;
    //         default:
    //             content = <ClothingAndAccessories {...props} />;
    //     }

    //     return content;
    // };
    // return <Layout>{renderProduct()}</Layout>;

    return (
        <Layout>
            <div className="card">
                <div className="cardHeader">
                    <div>Samsung under 10k</div>
                    <button>View All</button>
                </div>
                <div className="productContainer">
                    <div className="productImgContainer">
                        <img src="http://localhost:2000/public/NkLUcHqxY-samsung-galaxy-m30s.jpeg" alt=""/>
                    </div>
                    <div>
                        <div>Samsung 4gb phone</div>
                        <div>
                            <span>4.3</span>
                            <span>3353</span>
                        </div>
                        <div>5000</div>
                    </div>
                </div>
            </div>   
        </Layout>
    )

};

export default ProductListPage;