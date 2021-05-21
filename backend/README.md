#Backend

##MODELS
We have two models in for this app. 

* USER -> This model set up the requirements for the users. 
With enum of the three different types of users:
`
Enum = ['CUSTOMER', 'SUPPLIER', 'ADMIN']`

To sign up user, you must

`
 {
	 'email':'a@b.c',
	 'password':'abc123',
	 'role':'enum'
 }
 `
* RATING -> This model sets the rating from 'CUSTOMER' to 'SUPPLIER' and the rating range and date. 

##ROUTING
* /users GET - Requires authentication, returns all users.
* /users/:id GET - Requires authentication, returns requested user with specified id.
* /users/:id/ratings GET - Requires authentication, returns all ratings for the requested user have made.
* /hairdressers/:id/ratings GET - No authentication, returns all ratings for the requested hairdresser.
* /hairdressers/:id/ratings POST - Requires authentication, create a new rating for the specified hairdresser.



