import ReactStars from 'react-rating-stars-component';

const RatingChanged = () => {
	// User data e.g. current rating value
	// should come from store context

	const secondExample = {
		size: 50,
		count: 5,
		color: 'black',
		activeColor: 'red',
		value: 0,
		a11y: true,
		isHalf: true,
		emptyIcon: <i className='far fa-star' />,
		halfIcon: <i className='far fa-star-half-alt' />,
		onChange: (newValue) => {
			console.log(`Example 2 new value is ${newValue}`);
		},
	};

	return secondExample.value > 0 ? (
		<div>change rating</div>
	) : (
		<ReactStars {...secondExample} />
	);
};

export default RatingChanged;
