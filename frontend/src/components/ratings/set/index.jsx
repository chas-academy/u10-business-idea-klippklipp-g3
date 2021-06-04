import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Rating from 'react-rating-stars-component';
import jwt from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StoreContext from '../../../context/StoreContext';

const UserSetRatingComponent = ({ supplierId }) => {
	const {
		store: { lsin, apiUrl },
	} = useContext(StoreContext);
	const token = localStorage.getItem(lsin);

	// Re-render rating component
	const [starsKey, setStarsKey] = useState(null);
	// Default rating state
	const [hasRating, updateHasRating] = useState(false);

	const [editRating, updateEditRating] = useState(false);

	const setRating = (ratingValue) => {
		try {
			const options = {
				url: `${apiUrl}/hairdressers/${supplierId}/ratings`,
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					Authorization: `Bearer ${token}`,
				},
				data: {
					ratingValue,
				},
			};

			// Post rating
			axios(options);
			updateRatingSettings({
				...ratingSettings,
				value: ratingValue,
				edit: false,
			});
			setStarsKey(ratingValue);
			updateHasRating(true);
		} catch (error) {
			// Error object
			console.log(error);
		}
	};

	// Default rating settings
	const [ratingSettings, updateRatingSettings] = useState({
		size: 50,
		count: 5,
		activeColor: '#ffd700',
		value: 0,
		edit: true,
		emptyIcon: <FontAwesomeIcon icon='star' />,
		onChange: setRating,
	});

	useEffect(() => {
		const { id: userId } = jwt(token);

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
				if (response.length > 0) {
					response.forEach((rating) => {
						const { madeBy, refersTo, value } = rating;

						if (madeBy._id === userId && refersTo === supplierId) {
							updateRatingSettings({
								...ratingSettings,
								value: value,
								edit: false,
							});
							setStarsKey(value);
							updateHasRating(true);
						}
					});
				}
			} catch (error) {
				// Error object
				console.log(error);
			}
		};
		getRating();
	}, []);

	useEffect(() => {
		// Updating will need put route not in this branch
		// available in main line 154 auth.js backend
		// currently editing creates new db entry
		// no update on current
		updateRatingSettings({
			...ratingSettings,
			edit: !hasRating ? true : editRating,
		});
		setStarsKey(true);
	}, [editRating]);

	return (
		<>
			<section className='rate-container'>
				{hasRating && (
					<button onClick={() => updateEditRating(true)}>
						change rating
					</button>
				)}
				<h1>
					{hasRating ? (
						<>Your rating of this hairdresser</>
					) : (
						<>Rate Your experience with this hairdresser</>
					)}
				</h1>
				<Rating key={starsKey} {...ratingSettings} />
			</section>
		</>
	);
};

export default UserSetRatingComponent;
