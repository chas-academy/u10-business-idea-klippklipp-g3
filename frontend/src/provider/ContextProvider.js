// A simple hook based store
// We can use this to pass detached states
// around and not have to worry about prop-drilling
// or complex global state handling with redux

import React, { useState } from 'react';
import Context from '../context/StoreContext';
import { Modal } from 'bootstrap/dist/js/bootstrap';

// Table this for now, but we might need a helper foundation later on
// import { getLocal } from '../helpers';

const localStorageItemName = 'u10g3-app';

const StoreContext = ({ children }) => {
	// States used in global store access

	// Use localhost URL for API when not in production
	const apiUrl =
		process.env.NODE_ENV === 'production'
			? process.env.REACT_APP_API_PRODUCTION
			: process.env.REACT_APP_API_DEV;

	const [layout, setLayout] = useState({
		footer: {
			height: 0,
		},
	});

	const [isAuthed, setAuth] = useState(false);

	const unAuth = () => {
		localStorage.removeItem(localStorageItemName);
	};

	const defaultModal = {
		title: '',
		body: '',
	};
	const [modal, updateModal] = useState(defaultModal);
	// Custom bootstrap modal toggler
	// for programmatic controll, e.g
	// in conditions, delayed etc
	const toggleModal = () => {
		// Get modal element from DOM
		const modalToggleId = 'modalToggle';
		const modalEl = document.getElementById(modalToggleId);
		// Get existing modal instance
		const hasModal = Modal.getInstance(modalEl);
		// New instance or existing
		const modalObject = hasModal ? hasModal : new Modal(modalEl);
		// Toggle current modal state
		modalObject.toggle(modalEl);
	};

	const resetModal = () => {
		updateModal(defaultModal);
	};

	// Store is passed to context provider
	const store = {
		apiUrl,
		lsin: localStorageItemName,
		layouts: {
			layout,
			setLayout,
		},
		user: {
			isAuthed,
			setAuth,
			unAuth,
		},
		modals: {
			modal,
			updateModal,
			toggleModal,
			resetModal,
		},
	};

	return <Context.Provider value={{ store }}>{children}</Context.Provider>;
};

export default StoreContext;
