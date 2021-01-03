import React, {useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getProductsBySlug } from '../../actions/'
import { generatePublicUrl } from '../../urlConfig'

import Layout from "../../components/Layout";
import getParams from "../../utils/getParams";
// import ClothingAndAccessories from "./ClothingAndAccessories";
import ProductPage from "./ProductPage";
import ProductStore from "./ProductStore";
import "./style.css";


const ProductListPage = (props) => {

    const dispatch = useDispatch()
    const product = useSelector(state => state.product)

    const renderProduct = () => {
        
        // props.location.search >>> ?cid=5fcf130200b49073b48420c1&type=undefined
        const params = getParams(props.location.search);    // {cid: "5fcf130200b49073b48420c1", type: "page"}
        let content = null;

        switch (params.type) {

            case "store":
                content = <ProductStore {...props} />;
            break;
            case "page":
                content = <ProductPage {...props} />;
            break;
            default:
                // content = <ClothingAndAccessories {...props} />;
                content = ""
        }

        return content;
    };
    return <Layout>{renderProduct()}</Layout>

}

export default ProductListPage;