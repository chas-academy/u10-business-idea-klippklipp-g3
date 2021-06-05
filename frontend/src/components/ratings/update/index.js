import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import StoreContext from '../../../context/StoreContext';

const UpdateRating = ({ supplierId }) => {
	const [ratingInfo, setRatingInfo] = useState('');
	const [ratingValue, setRatingValue] = useState([]);
	const [averageRating, setAverageRating] = useState([]);
	const [showRating, setShowRating] = useState(false);

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
				response.forEach((rating) => {
					setRatingValue([rating.value, ...ratingValue]);
					setShowRating(true);
				});

				//get average rating from payload
				const responseRating = request.data.payload.average;
				setAverageRating(responseRating);
				setRatingInfo(response);
			} catch (error) {
				// Error object
				console.log(error);
			}
		};
		getRating();
	}, []);
	console.log(showRating);
	return (
		<>
			{showRating === true ? (
				<div>
					<span>
						<FontAwesomeIcon icon='star' color='#FFD700' />
						{averageRating} ({ratingInfo.length})
					</span>
				</div>
			) : (
				<h3>No rating</h3>
			)}
		</>
	);
};

export default UpdateRating;
