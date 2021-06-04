import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import StoreContext from '../../../context/StoreContext';
const UpdateRating = ({ supplierId }) => {
	const [ratingInfo, setRatingInfo] = useState('');
	const [ratingValue, setRatingValue] = useState([]);

	const {
		store: { lsin, apiUrl },
	} = useContext(StoreContext);
	const token = localStorage.getItem(lsin);

	useEffect(() => {
		const getRating = async () => {
			try {
				const options = {
					url: `${apiUrl}/hairdressers/${supplierId}/ratings`,
					headers: {
						'Content-Type': 'application/json; charset=UTF-8',
						Authorization: `Bearer ${token}`,
					},
				};

				// Await api response from request
				const request = await axios(options);
				// Success object
				const response = request.data.payload.ratings;

				response.map((rating) => {
					return setRatingValue([rating.value]);
				});
				/* 	response.forEach((element) => {
					return setRatingValue([element.value]);
				}); */

				setRatingInfo(response);
			} catch (error) {
				// Error object
				console.log(error);
			}
		};
		getRating();
	}, []);

	useEffect(() => {
		console.log(ratingValue);
	}, [ratingValue]);

	return (
		<>
			<div>{ratingInfo.length}</div>
			<h1>{ratingValue} hello?</h1>
		</>
	);
};

export default UpdateRating;
