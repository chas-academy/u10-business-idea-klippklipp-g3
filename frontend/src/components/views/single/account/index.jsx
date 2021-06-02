import React, {useContext} from 'react';
import jwt from 'jwt-decode';
import StoreContext from '../../../../context/StoreContext';

const AccountSingleView = () => {
	const {
		store: {
			lsin,
		},
	} = useContext(StoreContext);
	

	const token = localStorage.getItem(lsin);
	const payload = token ? jwt(token) : false;

	const {
		name,
		email,
		role,
	} = payload;

	return(
		<>
			<h1 className='user-name'>{name}</h1>
			<p>
				<strong>Role:</strong> '{role}'
			</p>
			<p>email: <a href={`mailto:${email}`}>{email}</a></p>
			<div className='user-container'>
				Maybe user (customer and supplier) can edit settings?
			</div>
		</>
	);
}

export default AccountSingleView;