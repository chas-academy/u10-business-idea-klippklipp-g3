import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import StoreContext from '../../context/StoreContext';
import Form from '../../components/auth';

import './style.scss';

const LayoutHeader = () => {
	const {
		store: {
			modals: { toggleModal, updateModal },
			user: { setAuth, isAuthed, unAuth },
		},
	} = useContext(StoreContext);

	const setLoginModal = () => {
		toggleModal();

		updateModal({
			title: 'Login',
			body: <Form type={'login'} />,
		});
	};

	const setSignupModal = () => {
		toggleModal();

		updateModal({
			title: 'Signup',
			body: <Form type={'signup'} />,
		});
	};

	const logoutUser = () => {
		unAuth();
		setAuth(false);
	};

	return (
		<header>
			<nav className='container-fluid navbar navbar-light bg-light p-1'>
				<Link to='/' className='navbar-brand'>
					U10G3
				</Link>

				<ul className='navbar-nav me-auto'>
					{isAuthed && (
						<li className='nav-item'>
							<Link to='/user' className='nav-link'>
								Profile
							</Link>
						</li>
					)}
				</ul>
				{!isAuthed ? (
					<>
						<button
							type='button'
							className='btn btn-outline-primary'
							onClick={setLoginModal}
						>
							login
						</button>
						<button
							type='button'
							className='btn btn-outline-info ms-2'
							onClick={setSignupModal}
						>
							Signup
						</button>
					</>
				) : (
					<button
						type='button'
						className='btn btn-primary'
						onClick={logoutUser}
					>
						logout
					</button>
				)}
			</nav>
		</header>
	);
};

export default LayoutHeader;
