import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jwt-decode';
import StoreContext from '../../../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserSetRating } from '../../../../components/ratings';

const SupplierSingleView = () => {
	const {
		store: {
			lsin,
			apiUrl,
			user: { isAuthed },
		},
	} = useContext(StoreContext);

	const [isLoading, setIsLoading] = useState(true);
	const [supplier, setSupplier] = useState(null);
	const [authedRole, setAuthedRole] = useState(null);

	const history = useHistory();
	const { id } = useParams();

	useEffect(() => {
		const token = localStorage.getItem(lsin);
		setAuthedRole(token && jwt(token).role);

		const getSupplier = async () => {
			try {
				// Await api response from request
				const request = await axios(`${apiUrl}/hairdressers/${id}`);
				// Success object
				const response = request.data;
				const userData =
					typeof response.payload.hairdresser !== 'undefined'
						? response.payload.hairdresser
						: history.push('/');

				setSupplier(userData);
				setIsLoading(false);
			} catch (error) {
				// Error object
				console.log(error);
			}
		};
		getSupplier();
	}, []);

	useEffect(() => {
		console.log(authedRole);
	}, [authedRole]);
	const SupplierComponent = () => {
		const { name, address, description, email } = supplier;
		const { street, zip, city } = address;

		return (
			<>
				<h1 className='user-name'>{name}</h1>
				<div className='user-container'>
					<h3>
						<span>
							<FontAwesomeIcon icon='star' />
						</span>
						4.7 (508 ratings)
					</h3>
					<div>
						<h3>
							<FontAwesomeIcon icon='map-pin' /> {street}
						</h3>
						<h4>
							{zip}, {city}
						</h4>
					</div>
				</div>
				<div className='underline'></div>
				<p className='user-description'>{description}</p>
				<section className='contact'>
					<h1>contact information</h1>
					<p>
						<FontAwesomeIcon icon='envelope' />{' '}
						<a href={`mailto:${email}`}>{email}</a>
					</p>
				</section>

				{isAuthed && authedRole === 'CUSTOMER' ? (
					<UserSetRating supplierId={id} />
				) : authedRole === 'SUPPLIER' ? (
					<>Only customer accounts are allowed to set ratings</>
				) : (
					<>Login or create account to set rating</>
				)}
			</>
		);
	};
	return isLoading ? <>Getting data</> : <SupplierComponent />;
};

export default SupplierSingleView;
