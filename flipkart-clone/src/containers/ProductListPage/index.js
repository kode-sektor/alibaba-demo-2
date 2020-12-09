import React, {useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getProductsBySlug } from '../../actions/'
import { generatePublicUrl } from '../../urlConfig'

import Layout from "../../components/Layout";
// import getParams from "../../utils/getParams";
// import ClothingAndAccessories from "./ClothingAndAccessories";
// import ProductPage from "./ProductPage";
// import ProductStore from "./ProductStore";
import "./style.css";


const ProductListPage = (props) => {

    const dispatch = useDispatch()
    const product = useSelector(state => state.product)

    // You are not passing props from another component
    // But you need it anyways just to fetch slug off it
    // console.log(props)

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
            {
                Object.keys(product.productsByPrice).map((key, index) => {
                    return (
                        <div key={index} className="card">
                            <div className="cardHeader">
                                 {/* under5k => under 5k */}
                                <div>{product.categoryName} {key.replace('under', 'under ')}</div>
                                <button>View All</button>
                            </div>
                            <div style={{display: 'flex'}}>

                                {
                                    (product.productsByPrice[key].length > 0) ? 

                                        product.productsByPrice[key].map(products => {
                                            const { _id, name, slug, price, quantity, productPictures, 
                                                reviews, description, createdAt, updatedAt 
                                            } = products 

                                            return (
                                                <div className="productContainer">
                                                    <div className="productImgContainer">
                                                        <img src={generatePublicUrl(productPictures[0].img)} alt=""/>
                                                    </div>
                                                    <div className="productInfo">
                                                        <div style={{margin: '5px 0'}}>{name}</div>
                                                        <div>
                                                            <span>4.3</span> &nbsp; 
                                                            (<span>3353</span>)
                                                        </div>
                                                        <div className="productPrice">{price}</div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        <div>No Products</div>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </Layout>
    )
}

export default ProductListPage;