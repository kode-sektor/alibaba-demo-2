import React from "react";
import { Modal, Button } from "react-bootstrap";
import Input from '../Input'

const NewModal = (props) => {

    return (
        <Modal size={props.size} show={props.show} onHide={props.handleShow}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                {props.buttons ? (
                    props.buttons.map((btn, index) => (
                        <Button key={index} variant={btn.color} onClick={btn.onClick}>
                        {btn.label}
                        </Button>
                    ))
                    ) : (
                    <Button onClick={props.handleClose}>
                        Save
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default NewModal