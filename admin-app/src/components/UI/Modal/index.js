import React from "react";
import { Modal, Button } from "react-bootstrap";
import Input from '../Input'

const NewModall = (props) => {

    return (
        <Modal size={props.size} show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input
                    value={props.categoryName}
                    placeholder={`Category Name`}
                    onChange={props.setCategoryName}
                />
                <select onChange={props.changeParent} className="form-control" value={props.parentCategoryId}>
                    <option>SELECT CATEGORY</option>
                    {
                        props.categoryList.map(option => {
                            return (
                                <option key={option.value} value={option.value}>{option.name}</option>
                            )
                        })
                    }
                </select>
                <input type="file" name="categoryImage" onChange={props.handleCategoryImage}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.handleClose}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>


        // <Modal size={props.size} show={props.show} onHide={props.handleClose}>
        //     <Modal.Header closeButton>
        //         <Modal.Title>{props.modalTitle}</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body>{props.children}</Modal.Body>
        //     <Modal.Footer>
        //         {props.buttons ? (
        //         props.buttons.map((btn, index) => (
        //             <Button key={index} variant={btn.color} onClick={btn.onClick}>
        //             {btn.label}
        //             </Button>
        //         ))
        //         ) : (
        //         <Button onClick={props.handleClose}>
        //             Save
        //         </Button>
        //         )}
        //     </Modal.Footer>
        // </Modal>
    );
};

export default NewModall