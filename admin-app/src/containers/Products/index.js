import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Container, Row, Col, Table } from "react-bootstrap";
import Input from "../../components/UI/Input";
import Modal from "../../components/UI/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
    addProduct,
    addCategory,
    // updateCategories,
    // deleteCategories as deleteCategoriesAction
} from '../../actions';
import { generatePublicUrl } from "../../urlConfig";
import "./style.css";


const Products = (props) => {

    const dispatch = useDispatch();

    const category = useSelector((state) => state.category);
    const product = useSelector((state) => state.product);

    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [productPictures, setProductPictures] = useState([]);

    const [show, setShow] = useState(false);
    const [productDetailModal, setProductDetailModal] = useState(false);
    const [productDetails, setProductDetails] = useState(null);

    const handleClose = () => {

        const form = new FormData();
        form.append("name", name);
        form.append("quantity", quantity);
        form.append("price", price);
        form.append("description", description);
        form.append("category", categoryId);

        for (let pic of productPictures) {
            form.append("productPicture", pic);
        }

        dispatch(addProduct(form));

        setShow(false);
    };

    // const submitProductForm = () => {
    //     const form = new FormData();
    //     form.append("name", name);
    //     form.append("quantity", quantity);
    //     form.append("price", price);
    //     form.append("description", description);
    //     form.append("category", categoryId);

    //     for (let pic of productPictures) {
    //         form.append("productPicture", pic);
    //     }

    //     dispatch(addProduct(form));
    // };

    const handleShow = () => show ? setShow(false) : setShow(true)  // For modal


    // For the categories in the dropdown 
    const createCategoryList = (categories, options = []) => {

        for (let category of categories) {
            options.push({ value: category._id, name: category.name });
            if (category.children.length > 0) {
                createCategoryList(category.children, options);
            }
        }
        return options;
    };

    const handleProductPictures = (e) => {
        console.log([...productPictures, e.target.files[0]])
        setProductPictures([...productPictures, e.target.files[0]]);
    };


    const showProductDetailsModal = (product) => {
        setProductDetails(product);
        productDetailModal ? setProductDetailModal(false) : setProductDetailModal(true)
    };

    const handleCloseProductDetailsModal = () => {
        setProductDetailModal(false);
    };

    // Modal for adding
    const renderAddProductModal = () => {
        return (
            <Modal
                show={show}
                handleClose={handleClose}   // For the save button
                handleShow={handleShow}     // For toggling form
                title={"Add New Product"}
            >
                <Input
                    label="Name"
                    value={name}
                    placeholder={`Product Name`}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Quantity"
                    value={quantity}
                    placeholder={`Quantity`}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                    label="Price"
                    value={price}
                    placeholder={`Price`}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                    label="Description"
                    value={description}
                    placeholder={`Description`}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <select
                    className="form-control"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option>Select category</option>
                    {createCategoryList(category.categories).map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.name}
                        </option>
                    ))}
                </select>
                    {productPictures.length > 0
                    ? productPictures.map((pic, index) => (
                        <div key={index}>{pic.name}</div>
                        ))
                    : null}
                <input
                    type="file"
                    name="productPicture"
                    onChange={handleProductPictures}
                />
            </Modal>
        )
    }

    const renderProductDetailsModal = () => {
        if (!productDetails) {
            return null;
        }

        return (
            <Modal
                show={productDetailModal}
                handleClose={handleCloseProductDetailsModal}   // For the save button
                handleShow={showProductDetailsModal}     // For toggling form
                title={"Product Details"}
                size="lg"
            >
                <Row>
                    <Col md="6">
                        <label className="key">Name</label>
                        <p className="value">{productDetails.name}</p>
                    </Col>
                    <Col md="6">
                        <label className="key">Price</label>
                        <p className="value">{productDetails.price}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <label className="key">Quantity</label>
                        <p className="value">{productDetails.quantity}</p>
                    </Col>
                    <Col md="6">
                        <label className="key">Category</label>
                        <p className="value">{productDetails.category.name}</p>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <label className="key">Description</label>
                        <p className="value">{productDetails.description}</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <label className="key">Product Pictures</label>
                        <div style={{ display: "flex" }}>
                            {productDetails.productPictures.map((picture) => (
                                <div className="productImgContainer">
                                    <img src={generatePublicUrl(picture.img)}/>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Modal>
        );
    };

    const renderProducts = () => {

        return (
            <Table style={{ fontSize: 12 }} responsive="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                {product?.products.length > 0
                    ? product.products.map((product) => (
                        <tr key={product._id}
                            onClick={() => showProductDetailsModal(product)}
                        >
                            <td>2</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.category?.name}</td>
                        </tr>
                    ))
                    : null}
                </tbody>
            </Table>
        );
    };

    return (
        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h3>Products</h3>
                            <button onClick={handleShow}>Add</button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>{renderProducts()}</Col>   {/* The table */}
                </Row>
            </Container>
            
            {renderAddProductModal()}     {/* Modal for adding */}
            {renderProductDetailsModal()}   {/* Modal for rendering a product row's details on click */}
        </Layout>
    );
    
};

export default Products;