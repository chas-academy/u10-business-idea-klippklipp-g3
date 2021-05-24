# CAU10 - Frontend

## font Awesome icon library

[Installation documentation](https://fontawesome.com/how-to-use/on-the-web/using-with/react)
[Find available icons](https://fontawesome.com/icons?d=gallery&p=2&m=free)

### Usage in components

    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

```jsx
export const Beverage = () => (
	<div>
		<FontAwesomeIcon icon='check-square' />
		Your <FontAwesomeIcon icon='coffee' /> is hot and ready!
	</div>
);
```
