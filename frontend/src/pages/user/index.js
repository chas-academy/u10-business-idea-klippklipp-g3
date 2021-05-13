import React, { useContext } from 'react';
import StoreContext from '../../context/StoreContext';

import './style.scss';

const UserPage = () => {
	const {
		store: {
			user: { payload },
		},
	} = useContext(StoreContext);

	const { email } = payload;

	return (
		<article>
			<h1>Hello user</h1>
			<p>email: {email}</p>
		</article>
	);
};

export default UserPage;
