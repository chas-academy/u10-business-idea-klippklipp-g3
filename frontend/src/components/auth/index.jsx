import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import StoreContext from '../../context/StoreContext';
import axios from 'axios';

import './style.scss';

const Form = ({ type }) => {
	const enumTypes = [
		{
			label: 'customer',
			display: 'Customer',
			type: 'CUSTOMER',
		},
		{
			label: 'supplier',
			display: 'Hairdresser',
			type: 'SUPPLIER',
		},
	];
	// Get global store context
	const {
		store: {
			apiUrl,
			lsin,
			user: { setAuth },
			modals: { toggleModal, resetModal },
		},
	} = useContext(StoreContext);

	// States
	const [formValues, updateFormValues] = useState({
		email: '',
		password: '',
		name: '',
		role: '',
		description: '',
		address: {
			street: '',
			city: '',
			zip: '',
		},
	});

	const [isFormValid, setIsFormValid] = useState(false);
	const [formError, setFormError] = useState(false);
	const [connectionError, setConnetctionError] = useState(false);

	// Use history for redirecting
	const history = useHistory();

	useEffect(() => {
		// Deconstructe required fields
		const {
			name,
			email,
			password,
			role,
			description,
			address: {
				street,
				city,
				zip
			}
		} = formValues;

		switch (type) {
			case 'signup':
				const customerTestArray = [
					name,
					email,
					password,
					role,
				]
				const supplierTestArray = [
					name,
					email,
					password,
					role,
					description,
					street,
					city,
					zip
				]
				// Test truthy falsy
				const customerTest = customerTestArray.every(value => value !== '');
				const supplierTest = supplierTestArray.every(value => value !== '');
				// Differentiate test between customer and supplier
				setIsFormValid(role === 'CUSTOMER' ? customerTest : supplierTest);
				break;
				
			case 'login':
				const loginTestArray = [
					email,
					password,
				]
				// Test truthy falsy
				const loginTest = loginTestArray.every(value => value !== '');
				// Differentiate test between customer and supplier
				setIsFormValid(loginTest);
				break;
		
			default:
				break;
		}
	}, [formValues])

	// Process form data
	const processForm = async (e) => {
		// Prevent default form onSubmit action
		e.preventDefault();

		if (isFormValid) {

			let url, data;
			// Deconstructe required fields
			const {
				name,
				email,
				password,
				role,
				description,
				address: {
					street,
					city,
					zip
				}
			} = formValues;
			
			switch (type) {
				case 'login':
					url = `${apiUrl}/signin`;
					data = {
						email,
						password,
					};
					break;
					
				case 'signup':
					url = `${apiUrl}/signup`;
					data = role === 'CUSTOMER' ?
					{
						name,
						email,
						password,
						role,
					}
					:
					{
						name,
						email,
						password,
						role,
						description,
						address:{
							street,
							city,
							zip,
						}
					};
					break;
			
				default:
					break;
			}

			// Let's try and get/create user from/to server
			try {
				// Set up API request
				const options = {
					url,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
					},
					data,
				};

				// Await api response from request
				const request = await axios(options);
				// Success object
				const response = request.data;
				
				if (typeof response !== 'undefined' && response.token) {
					// Update user states
					setAuth(true);
					// Set token in localStorage
					localStorage.setItem(lsin, response.token);
					// Handle modal
					toggleModal();
					resetModal();
					// Redirect user to user page
					history.push('/user');
				} else {
					// Something went wrong while
					// talking to the server
					setConnetctionError(true);
				}

			} catch (error) {
				// Error object
				console.log(error);
			}

		} else {
			// Incomplete form data
			setFormError(true);
		}
	};

	return (
		<form onSubmit={(e) => processForm(e)} id='form'>
			{connectionError && (
				<div
					className='alert alert-danger alert-dismissible fade show'
					role='alert'
				>
					There was a problem connecting to the server. Check the console for errors.
					<button
						type='button'
						className='btn-close'
						data-bs-dismiss='alert'
						aria-label='Close'
					></button>
				</div>
			)}
			{formError && (
				<div
					className='alert alert-danger alert-dismissible fade show'
					role='alert'
				>
					Please make sure to fill in all fields.
					<button
						type='button'
						className='btn-close'
						data-bs-dismiss='alert'
						aria-label='Close'
					></button>
				</div>
			)}

			{type === 'signup' &&
				<div className='mb-1'>
					<label htmlFor='email' className='form-label'>
						Name
					</label>
					<input
						type='name'
						className='form-control'
						id='name'
						aria-describedby='name'
						value={formValues.name}
						onChange={(e) =>
							updateFormValues({
								...formValues,
								name: e.target.value,
							})
						}
					/>
				</div>
			}

			<div className='mb-1'>
				<label htmlFor='email' className='form-label'>
					Email
				</label>
				<input
					type='email'
					className='form-control'
					id='email'
					aria-describedby='email'
					value={formValues.email}
					onChange={(e) =>
						updateFormValues({
							...formValues,
							email: e.target.value,
						})
					}
				/>
			</div>

			<div className='mb-1'>
				<label htmlFor='password' className='form-label'>
					Password
				</label>
				<input
					type='password'
					className='form-control'
					id='password'
					value={formValues.password}
					onChange={(e) =>
						updateFormValues({
							...formValues,
							password: e.target.value,
						})
					}
				/>
			</div>

			{type === 'signup' &&
				<>
					<ul
						id='signup-role-radio'
						onChange={(e) => 
							updateFormValues({
								...formValues,
								role: e.target.value,
							})
						}
					>
					{
						enumTypes.map((enumType, idx) => {
							const { label, display, type } = enumType;

							return(
								<li key={`signup-select-role-${idx}`}>
									<input type='radio' id={label} name='role' value={type} />
									<label htmlFor={label}>{display}</label>
								</li>
							);

						})
					}
					</ul>
					{formValues.role === 'SUPPLIER' &&
						<>
							<div className='mb-1'>
								<label htmlFor='street' className='form-label'>
									Street
								</label>
								<input
									type='street'
									className='form-control'
									id='street'
									aria-describedby='street'
									value={formValues.address.street}
									onChange={(e) =>
										updateFormValues({
											...formValues,
											address: {
												...formValues.address,
												street: e.target.value
											},
										})
									}
								/>
							</div>
							<div className='mb-1'>
								<label htmlFor='city' className='form-label'>
									City
								</label>
								<input
									type='city'
									className='form-control'
									id='city'
									aria-describedby='city'
									value={formValues.address.city}
									onChange={(e) =>
										updateFormValues({
											...formValues,
											address: {
												...formValues.address,
												city: e.target.value
											},
										})
									}
								/>
							</div>
							<div className='mb-1'>
								<label htmlFor='zip' className='form-label'>
									Zip
								</label>
								<input
									type='zip'
									className='form-control'
									id='zip'
									aria-describedby='zip'
									value={formValues.address.zip}
									onChange={(e) =>
										updateFormValues({
											...formValues,
											address: {
												...formValues.address,
												zip: e.target.value
											},
										})
									}
								/>
							</div>

							<div className='mb-1'>
								<label htmlFor='description' className='form-label'>
									Description
								</label>
								<input
									type='description'
									className='form-control'
									id='description'
									aria-describedby='description'
									value={formValues.description}
									onChange={(e) =>
										updateFormValues({
											...formValues,
											description: e.target.value,
										})
									}
								/>
							</div>
						</>
					}
				</>
			}
			<button type='submit' className='btn btn-primary'>
				{type}
			</button>
		</form>
	);
};

export default Form;
