import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import StoreContext from '../../../context/StoreContext';
import jwt from 'jwt-decode';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import './style.scss';

const RatingForm = () => {
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
	const history = useHistory();

	const loginAuth = async (e) => {
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
	const secondExample = {
		size: 50,
		count: 5,
		color: 'black',
		activeColor: '#363636',
		value: 0,
		a11y: true,
		emptyIcon: <i className='far fa-star' />,
		halfIcon: <i className='far fa-star-half-alt' />,
		onChange: (newValue) => {
			console.log(`Example 2 new value is ${newValue}`);
			loginAuth(newValue);
		},
	};

	return (
		<form onSubmit={(e) => loginAuth(e)} className='form-signin'>
			{secondExample.value > 0 ? (
				<div>change rating</div>
			) : (
				<ReactStars {...secondExample} />
			)}
			<button type='submit' className='btn btn-primary'>
				Signup
			</button>
		</form>
	);
};

export default RatingForm;
