import React, { useState, useEffect } from 'react';
import Modal from '../../components/UI/Modal';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';
import { Container, Row, Col } from 'react-bootstrap';
import linearCategories from '../../helpers/linearCategories';
import { useSelector, useDispatch } from 'react-redux';
import { createPage } from '../../actions';


const NewPage = (props) => {

    const [createModal, setCreateModal] = useState(false);
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState('');
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);

    const category = useSelector(state => state.category);

    const dispatch = useDispatch();
    const page = useSelector(state => state.page);


    useEffect(() => {
        setCategories(linearCategories(category.categories));
    }, [category]);

    useEffect(() => {
        console.log(page);
        if(!page.loading){
            setCreateModal(false);
            setTitle('');
            setCategoryId('');
            setDesc('');
            setProducts([]);
            setBanners([]);
        }
    }, [page]);

    const onCategoryChange = (e) => {
        const category = categories.find(category => category.value == e.target.value);
        setCategoryId(e.target.value);
        setType(category.type);
    }

    const handleBannerImages = (e) => {
        console.log(e.target.files);
        console.log(e.target.files[0]);
        setBanners([...banners, e.target.files[0]]);
    }

    const handleProductImages = (e) => {
        // console.log(e);
        setProducts([...products, e.target.files[0]]);
    }

    const submitPageForm = (e) => {
        // e.target.preventDefault();

        if (title === "") {
            alert('Title is required');
            setCreateModal(false);  // close modal
            return; // exit
        }

        const form = new FormData();

        form.append('title', title);
        form.append('description', desc);
        form.append('category', categoryId);
        form.append('type', type);

        banners.forEach((banner, index) => {
            form.append('banners', banner);
        });
        products.forEach((product, index) => {
            form.append('products', product);
        });

       dispatch(createPage(form));
    }

    const renderCreatePageModal = () => {

        return (
            <Modal
                show={createModal}
                title={'Create New Page'}
                handleShow={() => setCreateModal(false)}
                handleClose={submitPageForm}
            >
                <Container>
                    <Row>
                        <Col>
                            <Input 
                                type="select"
                                value={categoryId}
                                onChange={onCategoryChange}
                                options={categories}
                                placeholder={'Select Category'}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={'Page Title'}
                                className=""
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Input
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder={'Page Description'}
                                className=""
                            />
                        </Col>
                    </Row>

                    {
                        banners.length > 0 ? 
                            banners.map((banner, index) => 
                                <Row key={index}>
                                    <Col>{banner.name}</Col>
                                </Row>
                        ) : null
                    }
                    <Row>
                        <span>Banner image(s): </span>
                        <Col>
                            <Input
                                className="form-control" 
                                type="file" 
                                name="banners"
                                onChange={handleBannerImages}
                            />
                        </Col>
                    </Row>

                    {   
                        products.length > 0 ? 
                            products.map((product, index) => 
                                <Row key={index}>
                                    <Col>{product.name}</Col>
                                </Row>
                        ) : null
                    }
                    <Row>
                        <span>Product image(s): </span>
                        <Col>
                            <Input 
                                className="form-control"
                                type="file" 
                                name="products"
                                onChange={handleProductImages}
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal>
        );
    }

    return (
        <Layout sidebar>
            {
                page.loading ? 
                <p>Creating Page... Please wait</p>
                :
                <>
                    {renderCreatePageModal()}
                    <button onClick={() => setCreateModal(true)}>Create Page</button>
                </>
            }
        </Layout>
    )
}

export default NewPage
