import React, { useContext, useEffect, useState } from 'react';
import StoreContext from '../../../context/StoreContext';
import axios from 'axios';
import View from './view';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { RatingForm } from '../../star-rating';
import './style.scss';

const ProfileSingleView = ({ userId: id }) => {
	const {
		store: { lsin, apiUrl },
	} = useContext(StoreContext);

	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem(lsin);
		const getProfile = async () => {
			try {
				// Set up API request
				const options = {
					url: `${apiUrl}/users/${id}`,
					// method: 'POST',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
						Authorization: 'Bearer ' + token,
					},
					data: {
						id: id,
					},
				};
				// Await api response from request
				const request = await axios(options);
				// Success object
				setProfile(request.data.payload.user);
				setTimeout(() => {
					setLoading(false);
				}, 2000);
			} catch (error) {
				// Error object
				console.log(error);
				return false;
			}
		};
		getProfile();
	}, []);

	return (
		<>
			{loading ? <>Loading</> : <View data={profile} />}
			{/* <h1 className='user-name'>
				<span>FirstName</span>
				&nbsp;LastName
			</h1>
			<div className='user-container'>
				<h3>
					<span>
						<FontAwesomeIcon icon='star' />
					</span>
					4.7 (508 ratings)
				</h3>
				<div>
					<h3>
						<FontAwesomeIcon icon='map-pin' /> Nils Grises Sträte 8
					</h3>
					<h4>113 57, Stckholm</h4>
				</div>
			</div>
			<div className='underline'></div>
			<p className='user-description'>
				Nullam metus ex, molestie ac arcu sit amet, tempor euismod sem.
				Etiam imperdiet dolor eget pretium sagittis. Aliquam erat
				volutpat. Maecenas commodo justo vel leo euismod
			</p>
			<section className='contact'>
				<h1>contact information</h1>

				<p>
					<FontAwesomeIcon icon='phone' /> 08595238922
				</p>
				<p>
					<FontAwesomeIcon icon='envelope' /> Random@mail.com
				</p>
			</section>
			<section className='rate-container'>
				<h1>Rate Your experience</h1>
				<RatingForm />
			</section>
			*/}
		</>
	);
};

export default ProfileSingleView;
