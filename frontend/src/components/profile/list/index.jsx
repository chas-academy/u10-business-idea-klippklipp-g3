import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../../../context/StoreContext';
import './style.scss';
const ProfileListView = () => {
	const {
		store: { apiUrl },
	} = useContext(StoreContext);

	const [haveProfiles, updateProfiles] = useState(false);

	useEffect(() => {
		const getProfiles = async () => {
			try {
				// Set up API request
				const options = {
					url: `${apiUrl}/hairdressers`,
				};

				// Await api response from request
				const request = await axios(options);
				// Success object
				const response = request.data;
				updateProfiles(response.payload.users);
				return;
			} catch (error) {
				// Error object
				console.log(error);
			}
		};
		getProfiles();
		// const profiles = getProfiles();
		// updateProfiles(profiles.payload.users);
		// console.log(profiles);
	}, []);

	return !haveProfiles ? (
		<>No Profiles</>
	) : (
		<section className='hairdressers-container'>
			{haveProfiles.map((profile, idx) => {
				const { _id: id, email } = profile;
				const profileUrl = `profile/${id}`;
				return (
					<Link className='hairdressers-list' to={profileUrl}>
						<h3 className='fw-regular'>Name of hairdressers</h3>
						<h5
							className='fw-regular'
							key={`list-view-profile-${idx}`}
						>
							{email}
						</h5>
						<p>Sibyllegatan 32, 114 43, Stockholm</p>
					</Link>
				);
			})}
		</section>
	);
};

export default ProfileListView;
