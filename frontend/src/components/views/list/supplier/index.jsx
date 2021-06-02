import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StoreContext from '../../../../context/StoreContext';
import axios from 'axios';

const SupplierListComponent = () => {

	const {
		store: {
			apiUrl,
		},
	} = useContext(StoreContext);

	const [isLoading, setIsLoading] = useState(true);
	const [suppliers, setSuppliers] = useState(null);

	useEffect(() => {
		const getSuppliers = async () => {
			try {
				// Await api response from request
				const request = await axios(`${apiUrl}/hairdressers`);
				// Success object
				const response = request.data;
				
				setSuppliers(response.payload.hairdressers);
				setIsLoading(false);
			} catch (error) {
				// Error object
				console.log(error);
			}
		}
		getSuppliers();
	}, [])

	return(
		isLoading ?
			<>Loading profiles</>
		:
			suppliers.length ?
				<ul>
					{
						suppliers.map((sup, idx) => {
							const {
								_id: userId,
								name,
							} = sup;
							return(
								<li key={`supplier-list-item-${idx}`}>
									<Link
										to={`user/${userId}`}
									>
										{name}
									</Link>
								</li>
							);
						})
					}
				</ul>
			:
				<>No Profiles</>
	);
}

export default SupplierListComponent;