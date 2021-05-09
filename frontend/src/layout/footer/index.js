import React, { useContext, useRef, useEffect } from 'react';
import StoreContext from '../../context/StoreContext';

import './style.scss';

const LayoutFooter = () => {
	const {
		store: {
			layouts: { setLayout },
		},
	} = useContext(StoreContext);

	const footerRef = useRef(0);

	useEffect(() => {
		setLayout((layout) => {
			return {
				...layout,
				footer: {
					height: footerRef.current.clientHeight,
				},
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [footerRef]);

	return (
		<footer ref={footerRef} id='main-footer' className='bg-dark'>
			<article className='container text-light'>
				<div className='row'>
					<div className='col'>
						Spinning violently around the y-axis in the footer
					</div>
					<div className='col'>
						Hum something loud while others stare
					</div>
					<div className='col'>Follow the white rabbit</div>
				</div>
			</article>
		</footer>
	);
};

export default LayoutFooter;
