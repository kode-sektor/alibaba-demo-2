 import React from "react";
 import { Form } from 'react-bootstrap'

export default function index({
	label, type, placeholder, value, errorMessage, onChange
}) {
	return (
		<Form.Group>
			{label && <Form.Label>{label}</Form.Label>}
			<Form.Control 
				type={type} 
				placeholder={placeholder} 
				value={value}
				onChange={onChange}
			/>
			<Form.Text className="text-muted">
				{errorMessage}
			</Form.Text>
		</Form.Group>
	);
}

