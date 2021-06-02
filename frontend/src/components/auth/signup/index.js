import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import StoreContext from '../../../context/StoreContext';
import jwt from 'jwt-decode';
import axios from 'axios';

import './style.scss';

const SignupForm = () => {
	const {
		store: {
			apiUrl,
			lsin,
			user: { setAuth },
			modals: { toggleModal, resetModal },
		},
	} = useContext(StoreContext);

	const [errorAuth, setErrorAuth] = useState(false);
	const [errorEmail, setErrorEmail] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [role, setRole] = useState(false);
	const [nameValue, setNameValue] = useState('');
	const [errorName, setErrorName] = useState(false);
	const [errorRole, setErrorRole] = useState(false);
	const [emailValue, updateEmailValue] = useState('');
	const [passwordValue, updatePasswordValue] = useState('');
	const [descriptionValue, setDescriptionValue] = useState('');

	//set on checkbox to false if the another one is true
	const [checkedCustomer, setCheckedCustomer] = useState(false);
	const [checkedSupplier, setCheckedSupplier] = useState(false);

	const history = useHistory();

	const loginAuth = async (e) => {
		e.preventDefault();

		let response;

		if (emailValue && passwordValue && role && nameValue) {
			// Let's try and get user from server
			try {
				// Set up API request
				const options = {
					url: `${apiUrl}/signup`,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
					},
					data: {
						email: emailValue,
						password: passwordValue,
						role: role,
						name: nameValue,
					},
				};

				// Await api response from request
				const request = await axios(options);
				// Success object
				response = request.data;
			} catch (error) {
				// Error object
				console.log(error);
			}

			if (typeof response !== 'undefined' && response.token) {
				// Update user states
				setAuth(true);
				// Set payload to localStorage
				localStorage.setItem(lsin, response.token);
				// Handle modal
				toggleModal();
				resetModal();
				// Redirect user to user page
				history.push('/user');
			} else {
				// Something went wrong while
				// talking to the server
				setErrorAuth(true);
			}
		} else {
			// Missing name
			!nameValue && setErrorName(true);
			// Missing email
			!emailValue && setErrorEmail(true);
			// Missing password
			!passwordValue && setErrorPassword(true);
			// Missing Role
			!role && setErrorRole(true);
		}
	};
	const assignRole = (e) => {
		setRole(e.target.value);
	};
	const assignName = (e) => {
		setNameValue(e.target.value);
		if (e.target.value === 'SUPPLIER') {
			setCheckedCustomer(false);
		}
		if (e.target.value === 'CUSTOMER') {
			setCheckedSupplier(false);
		}
	};

	return (
		<form onSubmit={(e) => loginAuth(e)} className='form-signin'>
			{errorAuth && (
				<div
					className='alert alert-danger alert-dismissible fade show'
					role='alert'
				>
					There was a problem login in. Please check your email or
					password or role then try again.
					<button
						type='button'
						className='btn-close'
						data-bs-dismiss='alert'
						aria-label='Close'
					></button>
				</div>
			)}
			{errorName && (
				<div className='alert alert-danger' role='alert'>
					Name is required
				</div>
			)}
			<div className='mb-1'>
				<label htmlFor='name' className='form-label'>
					Name
				</label>
				<input
					type='text'
					className='form-control'
					id='name'
					aria-describedby='name'
					value={nameValue}
					onChange={assignName}
				/>
			</div>
			{errorEmail && (
				<div className='alert alert-danger' role='alert'>
					Email is required
				</div>
			)}
			<div className='mb-1'>
				<label htmlFor='email' className='form-label'>
					Email
				</label>
				<input
					type='email'
					className='form-control'
					id='email'
					aria-describedby='email'
					value={emailValue}
					onChange={(e) =>
						updateEmailValue(
							() => e.target.value,
							setErrorEmail(false),
						)
					}
				/>
			</div>

			{errorPassword && (
				<div className='alert alert-danger' role='alert'>
					Password is required
				</div>
			)}
			<div className='mb-1'>
				<label htmlFor='password' className='form-label'>
					Password
				</label>
				<input
					type='password'
					className='form-control'
					id='password'
					value={passwordValue}
					onChange={(e) =>
						updatePasswordValue(
							() => e.target.value,
							setErrorPassword(false),
						)
					}
				/>
			</div>
			{errorRole && (
				<div className='alert alert-danger' role='alert'>
					Role is required
				</div>
			)}
			<div className='form-check'>
				<input
					name='SUPPLIER'
					type='radio'
					className='form-check-input'
					id='supplier'
					value='SUPPLIER'
					checked={checkedSupplier}
					onChange={assignRole}
				/>
				<label className='form-check-label' htmlFor='supplier'>
					hairdressers
				</label>
			</div>
			<div className='form-check'>
				<input
					name='customer'
					type='radio'
					className='form-check-input'
					id='customer'
					value='CUSTOMER'
					checked={checkedCustomer}
					onChange={assignRole}
				/>
				<label className='form-check-label' htmlFor='customer'>
					customer
				</label>
			</div>
			{console.log(role)}
			{role === 'SUPPLIER' && (
				<div className='mb-1'>
					<label htmlFor='adress' className='form-label'>
						Adress
					</label>
					<input
						type='text'
						className='form-control'
						id='adress'
						value={role}
						onChange={assignRole}
					/>
					<label htmlFor='description' className='form-label'>
						Description
					</label>

					<input
						type='text'
						className='form-control'
						id='description'
						value={descriptionValue}
						onChange={(e) =>
							setDescriptionValue(() => e.target.value)
						}
					/>
				</div>
			)}
			<button type='submit' className='btn btn-primary'>
				Signup
			</button>
		</form>
	);
};

export default SignupForm;
