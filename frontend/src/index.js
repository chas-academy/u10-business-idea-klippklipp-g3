import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Main } from './layout';
import ContextProvider from './provider/ContextProvider';

import './styling/style.scss';

ReactDOM.render(
	<BrowserRouter>
		<ContextProvider>
			<Main />
		</ContextProvider>
	</BrowserRouter>,
	document.getElementById('root'),
);
