import React, {useState, useEffect, useContext} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../../../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SupplierSingleView = () => {

	const {
		store: {
			apiUrl,
		}
	} = useContext(StoreContext);

	const [isLoading, setIsLoading] = useState(true);
	const [supplier, setSupplier] = useState(null);
	
	const history = useHistory();
	const { id } = useParams();

	useEffect(() => {

		const getSupplier = async () => {
			try {
				// Await api response from request
				const request = await axios(`${apiUrl}/hairdressers/${id}`);
				// Success object
				const response = request.data;
				const userData = typeof response.payload.user !== 'undefined' ? response.payload.user : history.push('/');
				
				setSupplier(userData);
				setIsLoading(false);
			} catch (error) {
				// Error object
				console.log(error);
			}
		}
		getSupplier();
	}, [])

	const SupplierComponent = () => {
		const {address, description, email} = supplier;
		const {name, street, zip, city} = address;

		return(
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
					<h4>{zip}, {city}</h4>
				</div>
			</div>
			<div className='underline'></div>
			<p className='user-description'>{description}</p>
			<section className='contact'>
				<h1>contact information</h1>
				<p>
					<FontAwesomeIcon icon='envelope' /> <a href={`mailto:${email}`}>{email}</a>
				</p>
			</section>
			<section className='rate-container'>
				<h1>Rate Your experience with this hairdresser</h1>
				<p>
					<FontAwesomeIcon icon='star' />
					<FontAwesomeIcon icon='star' />
					<FontAwesomeIcon icon='star' />
					<FontAwesomeIcon icon='star' />
					<FontAwesomeIcon icon='star' />
				</p>
			</section>
		</>
		);
	}
	return(
		isLoading ?
		<>
			Getting data
		</>
		:
		<SupplierComponent />
	);
}

export default SupplierSingleView;