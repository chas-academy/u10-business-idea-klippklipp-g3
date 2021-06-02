import React from 'react';

const ProfileViewComponent = ({ data: { email } }) => {
	return <section>Profile for {email}</section>;
};

export default ProfileViewComponent;
