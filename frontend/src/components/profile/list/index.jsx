import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StoreContext from '../../../context/StoreContext';

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
		<ul>
			{haveProfiles.map((profile, idx) => {
				const { _id: id, email } = profile;
				const profileUrl = `profile/${id}`;

				return (
					<li key={`list-view-profile-${idx}`}>
						<Link to={profileUrl}>{email}</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default ProfileListView;
