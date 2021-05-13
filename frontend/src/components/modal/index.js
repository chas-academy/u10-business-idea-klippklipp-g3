import React, { useContext } from 'react';
import StoreContext from '../../context/StoreContext';

const Modal = () => {
	const {
		store: {
			modals: { toggleModal, modal },
		},
	} = useContext(StoreContext);

	return (
		<div
			className='modal fade'
			id='modalToggle'
			tabIndex='-1'
			aria-hidden='true'
		>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='modalToggleLabel'>
							{modal.title}
						</h5>
						<button
							type='button'
							className='btn-close'
							aria-label='Close'
							onClick={toggleModal}
						></button>
					</div>
					<div className='modal-body'>{modal.body}</div>
					<div className='modal-footer'>
						<button
							className='btn btn-outline-success'
							onClick={toggleModal}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
