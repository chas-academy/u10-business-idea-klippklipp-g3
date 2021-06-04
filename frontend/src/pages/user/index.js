import React from 'react';
import { useParams } from 'react-router-dom';

import { AccountSingleView, SupplierSingleView } from '../../components/views';

import './style.scss';

const UserPage = () => {
	const { id: pofileId } = useParams();

	return typeof pofileId === 'undefined' ? (
		<AccountSingleView />
	) : (
		<SupplierSingleView />
	);
};

export default UserPage;
