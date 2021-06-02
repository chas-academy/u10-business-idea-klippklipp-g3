import React from 'react';
import { ProfileSingleView } from '../../components/profile';
import { useParams } from 'react-router-dom';

const ProfileSinglePage = () => {
	const { id } = useParams();

	return <ProfileSingleView userId={id} />;
};

export default ProfileSinglePage;
