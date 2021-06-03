import React, { useContext } from 'react';
import StoreContext from './context/StoreContext';
import { Switch, Route, Redirect } from 'react-router-dom';
import { NotFound, LandingPage, UserPage } from './pages';

const Routes = () => {
	const {
		store: {
			user: { isAuthed },
		},
	} = useContext(StoreContext);

	// Protected routes for pages not accessible to guests
	const ProtectedRoute = ({ component: Page, path, ...rest }) => {
		return (
			<Route
				path={path}
				{...rest}
				render={(props) => {
					return isAuthed ? (
						<Page {...props} />
					) : (
						<Redirect
							to={{
								pathname: '/',
								state: {
									prevLocation: path,
								},
							}}
						/>
					);
				}}
			/>
		);
	};

	return (
		<Switch>
			<ProtectedRoute exact path='/user' component={UserPage} />
			<Route exact path='/user/:id' component={UserPage} />
			<Route exact path='/' component={LandingPage} />
			<Route component={NotFound} />
		</Switch>
	);
};

export default Routes;
