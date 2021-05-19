import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Main } from './layout';
import ContextProvider from './provider/ContextProvider';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faAirFreshener } from '@fortawesome/free-solid-svg-icons';

import './styling/style.scss';

library.add(fas, faAirFreshener);

ReactDOM.render(
	<BrowserRouter>
		<ContextProvider>
			<Main />
		</ContextProvider>
	</BrowserRouter>,
	document.getElementById('root'),
);
