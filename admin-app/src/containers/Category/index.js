import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    addCategory,
    updateCategories,
    getAllCategory,
    // deleteCategories as deleteCategoriesAction
} from '../../actions';

import Modal from '../../components/UI/Modal';
import Input from "../../components/UI/Input";

import {
    IoIosCheckboxOutline,
    IoIosCheckbox,
    IoIosArrowForward,
    IoIosArrowDown,
    IoIosAdd,
    IoIosTrash,
    IoIosCloudUpload
} from 'react-icons/io'

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
// import UpdateCategoriesModal from './components/UpdateCategoriesModal';
// import AddCategoryModal from './components/AddCategoryModal';
// import './style.css';


const Category = (props) => {

    const category = useSelector(state => state.category);  // categories from DB
    const dispatch = useDispatch();

    // Category values
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categoryImage, setCategoryImage] = useState('');

    const [show, setShow] = useState(false);    // For modal 

    // For react-checkbox-tree
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);

    const [checkedArray, setCheckedArray] = useState([]);
    const [expandedArray, setExpandedArray] = useState([]);

    const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);


    // useEffect(() => {

    //     if (!category.loading) {
    //         setShow(false);
    //     }

    // }, [category.loading]);


    // const handleClose = () => {

    //     const form = new FormData();

    //     if (categoryName === "") {
    //         alert('Category name is required');
    //         setShow(false);
    //         return;
    //     }

    //     form.append('name', categoryName);
    //     form.append('parentId', parentCategoryId);
    //     form.append('categoryImage', categoryImage);

    //     dispatch(addCategory(form));
    //     setCategoryName('');
    //     setParentCategoryId('');
    //     setShow(false);
    // }

    const handleShow = () => show ? setShow(false) : setShow(true)  // For modal

    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0]);
    }

    const handleClose = () => { // For modal

        const form = new FormData()
        const cat = {
            categoryName, 
            parentCategoryId,
            categoryImage
        }
        // console.log(cat)

        form.append('name', categoryName);
        form.append('parentId', parentCategoryId);
        form.append('categoryImage', categoryImage);
        
        // console.log(Array.from(form))

        dispatch(addCategory(form))
        
        setShow(false);   
    }

    // Prepare the ul list of categories
    const renderCategories = (categories) => {
        let myCategories = [];
        for (let category of categories) {
            myCategories.push(
                {
                    label : category.name,
                    value : category._id,
                    children : category.children.length > 0 && renderCategories(category.children)
                }
            )
        }
        return myCategories;
    }

    // Prepare the select dropdown of categories. It will not nest because 
    // <select><option> does not need nesting. It will just list the children under

    const createCategoryList = (categories, options = []) => {

        for (let category of categories) {
            options.push({
                value: category._id,
                name: category.name,
                parentId: category.parentId,
                type: category.type
            });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }
        return options;
    }

    //    const updateCheckedAndExpandedCategories = () => {
    
    const updateCategory = () => {

        // Fetch categories from DB, lining them up this way:
        // {value: "5fc2f39e7fa915b3e45a9a57", name: "Electronics", parentId: null, type: ""}
        // {value: "5fcf0c1600b49073b48420be", name: "Mobiles", parentId: "5fc2f39e7fa915b3e45a9a57", type: undefined}
        const categories = createCategoryList(category.categories); 

        const checkedArray = [];    
        const expandedArray = [];

        // For checkedArray, loop through checked categories and find match in categories from DB, 
        // then return full details: (Similar stuff goes for expandedArray too)
        // [{value: "5fc2f39e7fa915b3e45a9a57", name: "Electronics", parentId: null, type: ""}
        // {value: "5fcf0c1600b49073b48420be", name: "Mobiles", parentId: "5fc2f39e7fa915b3e45a9a57", type: undefined}]

        // Meanwhile : checked array  contains a simple array like so
        // automatically included by the checkbox-tree-plugin: 
        // ["5fcf12f500b49073b48420c0", "5fcf130200b49073b48420c1"]
        
        checked.length > 0 && checked.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value);
            category && checkedArray.push(category);
        })

        // Do the same for expandedArray
        expanded.length > 0 && expanded.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId == category.value);
            category && expandedArray.push(category);
        })

        console.log({checked, expanded, categories, checkedArray, expandedArray})

        setCheckedArray(checkedArray);
        setExpandedArray(expandedArray);

        setUpdateCategoryModal(true)
    }

    // On keyup of field:
    const handleCategoryInput = (key, value, index, type) => {

        if (type == "checked") {
            // For checked (i.e. Nested-level category e.g. Samsung)
            // Add something like 'name : Electronics' to checkedAarray
            const updatedCheckedArray = checkedArray.map((item, _index) => {
                return index == _index ? { ...item, [key] : value} : item
            })
            console.log("updatedCheckedArray >>> ", updatedCheckedArray)
            setCheckedArray(updatedCheckedArray)

        } else if (type == "expanded") {
            // For expanded (i.e. Parent-level category e.g. Electronics) On change of field, 
            // take value, and append / overwrite 'name : Electronics' in expandedArray
            // If its the dropdown, overwrite 'parentId : 5fc2f39e7fa915b3e45a9a57'
            const updatedExpandedArray = checkedArray.map((item, _index) => {
                return index == _index ? { ...item, [key] : value} : item
            })
            setExpandedArray(updatedExpandedArray)
        }
    }

    // Update Category Form
    const updateCategoriesForm = () => {
        const form = new FormData()

        // The final data format : 

//     _id: [ '5fc2f39e7fa915b3e45a9a57',
//         '5fcf0c1600b49073b48420be',
//         '5fcf130200b49073b48420c1',
//         '5fcf130d00b49073b48420c2' 
//         ],
//    name: [ 'Electronics', 'Mobiles', 'Samsunggg', 'Iphone' ],
//    parentId: [ '',
//         '5fc2f39e7fa915b3e45a9a57',
//         '5fcf0c1600b49073b48420be',
//         '5fcf0c1600b49073b48420be'
//         ] 
//     }

        expandedArray.forEach((item, index) => {
            form.append('_id', item.value)
            form.append('name', item.name)
            form.append('parentId', item.parentId ? item.parentId : "")
            form.append('type', item.type)
        })
        
        checkedArray.forEach((item, index) => {
            form.append('_id', item.value)
            form.append('name', item.name)
            form.append('parentId', item.parentId ? item.parentId : "")
            form.append('type', item.type)
        })

        dispatch(updateCategories(form))     // Send form data
            .then(result => {
                if (result) {
                    dispatch(getAllCategory())
                }
            })   

        setUpdateCategoryModal(false)    // Close modal
    }

    const deleteCategory = () => {
        // updateCheckedAndExpandedCategories();
        setDeleteCategoryModal(true);
    }

    const deleteCategories = () => {
        const checkedIdsArray = checkedArray.map((item, index) => ({ _id: item.value }));
        const expandedIdsArray = expandedArray.map((item, index) => ({ _id: item.value }));
        const idsArray = expandedIdsArray.concat(checkedIdsArray);

        // if (checkedIdsArray.length > 0) {
        //     dispatch(deleteCategoriesAction(checkedIdsArray))
        //         .then(result => {
        //             if (result) {
        //                 dispatch(getAllCategory())
        //                 setDeleteCategoryModal(false)
        //             }
        //         });
        // }

        setDeleteCategoryModal(false);
    }

    const renderDeleteCategoryModal = () => {

        return (
            <Modal
                title="Confirm"
                show={deleteCategoryModal}
                handleClose={() => setDeleteCategoryModal(false)}
                handleShow={() => setDeleteCategoryModal(false)}
                buttons={[
                    {
                        label: 'No',
                        color: 'primary',
                        onClick: () => {
                            alert('no');
                        }
                    },
                    {
                        label: 'Yes',
                        color: 'danger',
                        onClick: deleteCategories
                    }
                ]}
            >

                <h5>Expanded</h5>
                { expandedArray.map((item, index) => <span key={index}>{item.name}</span>)}
                <h5>Checked</h5>
                { checkedArray.map((item, index) => <span key={index}>{item.name}</span>)}

            </Modal>
        );
    }

        // The Add modal UI
        const renderAddCategoryModal = () => {
    
            return (
                
                // Modal for adding categories
                <Modal
                    show={show}
                    handleClose={handleClose}   // From the save button
                    handleShow={handleShow}     // From the close button (in modal)
                    title="Add New Category"
                    // setCategoryName={(e) => {setCategoryName(e.target.value)}}
                    // categoryList={createCategoryList(category.categories)}
                    // parentCategoryId={parentCategoryId}
                    // changeParent={(e) => setParentCategoryId(e.target.value)}
                    // handleCategoryImage={handleCategoryImage}
                >
                    <Input
                        value={categoryName}
                        placeholder={`Category Name`}
                        onChange={(e) => {setCategoryName(e.target.value)}}
                    />
                    <select name="name" onChange={(e) => setParentCategoryId(e.target.value)}
                        className="form-control" value={parentCategoryId}>
                        <option>Select Category</option>
                        {
                            createCategoryList(category.categories)?.map(option => {
                                return (
                                    <option key={option.value} value={option.value}>{option.name}</option>
                                )
                            })
                        }
                    </select>
                    <input type="file" name="categoryImage" onChange={handleCategoryImage}/>
                </Modal>
            )
        }
    
        // The Update modal UI
        const renderUpdateCategoriesModal = () => {
    
            return (
                
                // <UpdateCategoriesModal 
                <Modal
                    show={updateCategoryModal}
                    handleClose={updateCategoriesForm}   // From the save button (in modal)
                    handleShow={() => setUpdateCategoryModal(false)}   // From the close button (in modal)
                    onSubmit={updateCategoriesForm}
                    title={'Update Categories'}
                    size="lg"
                    // expandedArray={expandedArray}
                    // checkedArray={checkedArray}
                    // handleCategoryInput={handleCategoryInput}
                    // categoryList={categoryList}
                >
                    <Row>
                        <Col>
                            <h6>Expanded</h6>
                        </Col>
                    </Row>
                    {
                        // Loop through the user expanded selection
                        expandedArray.length > 0 && 
                        expandedArray.map((item, index) => 
                            <Row key={index}>
                                <Col>
                                    <Input
                                        value={item.name}
                                        placeholder={`Category Name`}
                                        // On change of field, take value, and append / overwrite 
                                        // 'name = Electronics' in expandedArray
                                        onChange={(e) => handleCategoryInput('name', e.target.value, index, 'expanded')}
                                    />
                                </Col>
                                <Col>
                                    <select 
                                        name="name" 
                                        className="form-control"
                                        value={item.parent}
                                        // On change of dropdown, take value and append / overwrite 
                                        // 'parentId: 5fc2f39e7fa915b3e45a9a57' in expandedArray
                                        onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'expanded')}
                                    >
                                        <option>Select Category</option>
                                        {
                                            createCategoryList(category.categories)?.map(option => {
                                                return (
                                                    <option key={option.value} value={option.value}>{option.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </Col>
                                <Col>
                                    <select className="form-control">
                                        <option value="">Select Type</option>
                                        <option value="store">Store</option>
                                        <option value="product">Product</option>
                                        <option value="page">Page</option>
                                    </select>
                                </Col>
                            </Row>
                        )
                    }
                    <h6>Checked Categories</h6>
                    {
                        // Loop through the user expanded selection
                        checkedArray.length > 0 && 
                        checkedArray.map((item, index) => 
                            <Row key={index}>
                                <Col>
                                    <Input
                                        value={item.name}
                                        placeholder={`Category Name`}
                                        onChange={(e) => handleCategoryInput('name', e.target.value, index, 'checked')}
                                    />
                                </Col>
                                <Col>
                                    <select 
                                        name="name" 
                                        className="form-control"
                                        value={item.parent}
                                        onChange={(e) => handleCategoryInput('parentId', e.target.value, index, 'checked')}
                                    >
                                        <option>Select Category</option>
                                        {
                                            createCategoryList(category.categories)?.map(option => {
                                                return (
                                                    <option key={option.value} value={option.value}>{option.name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </Col>
                                <Col>
                                    <select className="form-control">
                                        <option value="">Select Type</option>
                                        <option value="store">Store</option>
                                        <option value="product">Product</option>
                                        <option value="page">Page</option>
                                    </select>
                                </Col>
                            </Row>
                        )
                    }
                </Modal>
            )
        }    
    


    return (

        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Category</h3>
                            <div className="actionBtnContainer">
                                <span>Actions: </span>
                                <button onClick={handleShow}><IoIosAdd /> <span>Add</span></button>
                                <button onClick={deleteCategory}><IoIosTrash /> <span>Delete</span></button>
                                {/*<button onClick={updateCategory}><IoIosCloudUpload /> <span>Edit</span></button> */}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <CheckboxTree
                            nodes={renderCategories(category.categories)}   // Run function to fetch categories from 
                                                                            // DB inside collection
                            checked={checked}       // Automatically knows which one is checked and returns 
                                                    // ["5fcf123600b49073b48420bf", "5fcf12f500b49073b48420c0"]
                            expanded={expanded}     // ["5fc2f39e7fa915b3e45a9a57", "5fcf0c1600b49073b48420be"]
                            onCheck={checked => setChecked(checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={{
                                check: <IoIosCheckbox />,
                                uncheck: <IoIosCheckboxOutline />,
                                halfCheck: <IoIosCheckboxOutline />,
                                expandClose: <IoIosArrowForward />,
                                expandOpen: <IoIosArrowDown />
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <button onClick={deleteCategory}><IoIosTrash /> <span>Delete</span></button>

                        {/* On Click of 'Edit', lift checked categories and fill them inside form */}
                        <button onClick={updateCategory}><IoIosCloudUpload /> <span>Edit</span></button>
                    </Col>
                </Row>
            </Container>

            {renderAddCategoryModal()}
            {renderUpdateCategoriesModal()}
            {renderDeleteCategoryModal()}

            {/* Modal for editing / updating categories */}

            {/* <AddCategoryModal
                show={show}
                handleClose={() => setShow(false)}
                onSubmit={handleClose}
                modalTitle={'Add New Category'}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                parentCategoryId={parentCategoryId}
                setParentCategoryId={setParentCategoryId}
                categoryList={categoryList}
                handleCategoryImage={handleCategoryImage}
            />

            {/* {renderAddCategoryModal()} */}
            {/* {renderDeleteCategoryModal()} */}
        </Layout>
    )

}

export default Category

    // const handleCategoryInput = (key, value, index, type) => {
    //     console.log(value);
    //     if (type == "checked") {
    //         const updatedCheckedArray = checkedArray.map((item, _index) =>
    //             index == _index ? { ...item, [key]: value } : item);
    //         setCheckedArray(updatedCheckedArray);
    //     } else if (type == "expanded") {
    //         const updatedExpandedArray = expandedArray.map((item, _index) =>
    //             index == _index ? { ...item, [key]: value } : item);
    //         setExpandedArray(updatedExpandedArray);
    //     }
    // }

    // const updateCategoriesForm = () => {
    //     const form = new FormData();

    //     expandedArray.forEach((item, index) => {
    //         form.append('_id', item.value);
    //         form.append('name', item.name);
    //         form.append('parentId', item.parentId ? item.parentId : "");
    //         form.append('type', item.type);
    //     });
    //     checkedArray.forEach((item, index) => {
    //         form.append('_id', item.value);
    //         form.append('name', item.name);
    //         form.append('parentId', item.parentId ? item.parentId : "");
    //         form.append('type', item.type);
    //     });
    //     dispatch(updateCategories(form));
        
    // }


