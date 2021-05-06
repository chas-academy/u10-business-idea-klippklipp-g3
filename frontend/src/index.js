import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './layout';
import ContextProvider from './provider/ContextProvider';

import './styling/style.scss';

ReactDOM.render(
	<React.StrictMode>
		<ContextProvider>
			<Main />
		</ContextProvider>
	</React.StrictMode>,
	document.getElementById('root')
);