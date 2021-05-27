import { ReactStars } from 'react-rating-stars-component';

export const RatingChanged = () => {
	console.log();
	const secondExample = {
		size: 50,
		count: 10,
		color: 'black',
		activeColor: 'red',
		value: 7.5,
		a11y: true,
		isHalf: true,
		emptyIcon: <i className='far fa-star' />,
		halfIcon: <i className='fa fa-star-half-alt' />,
		filledIcon: <i className='fa fa-star' />,
		onChange: (newValue) => {
			console.log(`Example 2: new value is ${newValue}`);
		},
	};

	return <div></div>;
};
