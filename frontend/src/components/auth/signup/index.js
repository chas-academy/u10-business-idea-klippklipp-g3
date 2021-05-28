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
			user: { setAuth, updatePayload },
			modals: { toggleModal, resetModal },
		},
	} = useContext(StoreContext);

	const [errorAuth, setErrorAuth] = useState(false);
	const [errorEmail, setErrorEmail] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [emailValue, updateEmailValue] = useState('');
	const [passwordValue, updatePasswordValue] = useState('');
	const [role, setRole] = useState('');
	const history = useHistory();

	const loginAuth = async (e) => {
		e.preventDefault();

		let response;

		if (emailValue && passwordValue) {
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
						role: setRole,
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
				// Decode JWT and save payload data
				const payload = jwt(response.token);
				console.log(payload);
				// Update user states
				setAuth(true);
				updatePayload(payload);
				// Set payload to localStorage
				localStorage.setItem(lsin, JSON.stringify(payload));
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
			// Missing email
			!emailValue && setErrorEmail(true);
			// Missing password
			!passwordValue && setErrorPassword(true);
		}
	};

	return (
		<form onSubmit={(e) => loginAuth(e)} className='form-signin'>
			{errorAuth && (
				<div
					className='alert alert-danger alert-dismissible fade show'
					role='alert'
				>
					There was a problem login in. Please check your email and
					password then try again.
					<button
						type='button'
						className='btn-close'
						data-bs-dismiss='alert'
						aria-label='Close'
					></button>
				</div>
			)}
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

			{role && (
				<div className='alert alert-danger' role='alert'>
					register here
				</div>
			)}
			<div className='mb-1'>
				<label htmlFor='register' className='form-label'>
					Register
				</label>

				<input
					type='checkbox'
					className='form-control'
					id='register'
					value={role}
					onChange={(e) =>
						updatePasswordValue(
							() => e.target.value,
							setRole(false),
						)
					}
				/>
			</div>

			<button type='submit' className='btn btn-primary'>
				Signup
			</button>
		</form>
	);
};

export default SignupForm;
