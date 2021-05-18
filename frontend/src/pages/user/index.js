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
		<>
			<h1 className='user-name'>
				<span>FirstName</span>
				&nbsp;LastName
			</h1>
			<div className='flex-container'>
				<h3>
					<span>&#9733;</span> 4.7 (508 ratings)
				</h3>
				<div>
					<h3>
						<FaMapMarkerAlt /> Nils Grises Sträte 8
					</h3>
					<h4>113 57, Stckholm</h4>
				</div>
			</div>
			<div className='underline'></div>
			<p className='user-description'>
				Nullam metus ex, molestie ac arcu sit amet, tempor euismod sem.
				Etiam imperdiet dolor eget pretium sagittis. Aliquam erat
				volutpat. Maecenas commodo justo vel leo euismod
			</p>
			<section className='contact'>
				<h1>contact information</h1>
				<p>📞 08595238922</p>
				<p>📧 Random@mail.com</p>
			</section>
			<section className='rate-container'>
				<h1>Rate Your experience</h1>
				<p>&#9733; &#9733; &#9733; &#9733; &#9733;</p>
			</section>
		</>
	);
};

export default UserPage;
