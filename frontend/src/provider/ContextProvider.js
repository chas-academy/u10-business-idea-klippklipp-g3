// A simple hook based store
// We can use this to pass detached states
// around and not have to worry about prop-drilling
// or complex global state handling with redux

import React, { useState } from 'react';
import Context from '../context/StoreContext';

// Table this for now, but we might need a helper foundation later on
// import { getLocal } from '../helpers';

const StoreContext = ({ children }) => {

	// States used in global store access
	const [state, setState] = useState({
		default: 'values'
	});
	const [otherState, setOtherState] = useState(null);
	const [truthyFalsy, updateTruthyFalsy] = useState(true);
	
	// Store is passed to context provider
	const store = {
		states: {
			state,
			setState,
		},
		otherStates: {
			otherState,
			setOtherState,
		},
		truthyFalsys: {
			truthyFalsy,
			updateTruthyFalsy,
		},
	};

	return (
		<Context.Provider
			value={{ store }}
		>
			{children}
		</Context.Provider>
	)
}

export default StoreContext;