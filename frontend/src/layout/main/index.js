import { useContext, useEffect, useState } from 'react';
import StoreContext from '../../context/StoreContext';
// Layout
import { Header, Footer } from '../';
// Pages
import { LandingPage } from '../../pages';
// Style
import './style.scss';

const MainLayout = () => {
	
	// By deconstructing our store context
	// we now have access to our global states
	// and can set/update/mutate them as needed
	const {
		store: {
			truthyFalsys: {
				truthyFalsy,
				updateTruthyFalsy,
			},
		}
	} = useContext(StoreContext);

	// Local state, not used in our global store context
	const [counter, setCounter] = useState(8);

	useEffect(() => {
		counter > 0 && setTimeout(() => setCounter(counter - 1), 800);

		// For demonstrational purposes
		// 5s timeout, then set to false
		// Pretend this state is called loading ;)
		counter === 0 && updateTruthyFalsy(false);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [counter]);

	// useEffect hook handles component life cycle behavior
	useEffect(() => {
		console.log('This will show once, when the component is loaded. The empty array tells the useEffect hook that it should run only once and has no dependencies.');
	}, []);
	
	return(
		<>
			{ !truthyFalsy && <Header /> }
			
			<main className='container'>
				{ truthyFalsy ?
					<article id='loading-screen' className='text-center text-black'>
						<h1>Don't think of purple hippos for {counter}s! 🤷‍♂️</h1>
						
						<p className='ts-small muted'>Something something, darkside something, something something, complete.</p>
					</article>
				:
					<LandingPage />
				}
			</main>

			<Footer />
		</>
	);
}

export default MainLayout;