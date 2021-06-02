# Backend

## MODELS

We have two models in for this app.

-   USER -> This model set up the requirements for the users.
    With enum of the three different types of users:
    ` Enum = ['CUSTOMER', 'SUPPLIER', 'ADMIN']`

To sign up user, you must

`{ 'email':'a@b.c', 'password':'abc123', 'role':'enum' }`

-   RATING -> This model sets the rating from 'CUSTOMER' to 'SUPPLIER' and the rating range and date.

## ROUTING

-   /users GET - Requires authentication, returns all users.
-   /users/:id GET - Requires authentication, returns requested user with specified id.
-   /users/:id/ratings GET - Requires authentication, returns all ratings for the requested user have made.
-   /hairdressers/:id/ratings GET - No authentication, returns all ratings for the requested hairdresser.
-   /hairdressers/:id/ratings POST - Requires authentication, create a new rating for the specified hairdresser.

## API Endpoints

### Public routes

---

### Signup

Method: `POST`<br>
Path: `/signup`

#### Example of API request

```js
{
	"email": "test@test.com",
	"password": "password",
	"role": "CUSTOMER",
	"description": "Test account",
	"address": {
		"street": "Kungsgatan 34",
		"city": "Stockholm",
		"zip": 12345
	}
}
```

#### Fields in API request

-   `email` **Required**
-   `password` **Required**
-   `role` **Required** - valid values are _CUSTOMER_ and _SUPPLIER_
-   `description` **Optional** - max length 250
-   `address` **Optional**
    -   `street` Street address - max length 250
    -   `city` City name - max length 250
    -   `zip` Zip code - max length 20

#### Example of API response

```js
{
	"status": 200,
	"token": "<< Access token string >>",
	"id": "60a3d64ca927a100454cdf1d"
}
```

#### Fields in API response

-   `status` HTTP status code
-   `token` Access token for the newly signed up user
-   `id` ID for the newly created user

### Signin

Method: `POST`<br>
Path: `/signin`

#### Example of API request

```js
{
    "email": "test@test.com",
    "password": "password"
}
```

#### Fields in API request

-   `email` **Required**
-   `password` **Required**

#### Example of API response

```js
{
	"status": 200,
	"token": "<< Access token string >>",
	"id": "60a3d64ca927a100454cdf1d"
}
```

#### Fields in API response

-   `status` HTTP status code
-   `token` Access token for the signed in user
-   `id` ID for the signed in user

### Get all hairdressers

You can pass queries to filter out hairdressers based on address parameters. All hairdressers will be fetched if no queries are passed.

Method: `GET`<br>
Path: `/hairdressers`

#### Example of API request

```js
/hairdressers?street=kungsgatan&city=stockholm&zip=12345
```

#### Parameters in API request

-   `street` **Optional** - Street name
-   `city` **Optional** - City name
-   `zip` **Optional** - Swedish zip code (postnummer)

#### Example of API response

```js
{
	"status": 200,
    "payload": {
        "hairdressers": [
            {
                "role": "SUPPLIER",
                "_id": "60a3cc59952dd1002a795c3c",
                "email": "supplier@test.com",
				"description": "Supplier account",
                "address": {
                    "_id": "60afa5a7eb5d3c098b265462",
                    "street": "Kungsgatan 34",
                    "city": "Stockholm",
                    "zip": 12345
                },
            }
        ]
    }
}
```

#### Fields in API response

-   `hairdressers` List of hairdressers
    -   `role`
    -   `_id` Hairdresser ID
    -   `email`
    -   `description`
    -   `address`
        -   `_id` Address ID
        -   `street` Street name
        -   `city` City name
        -   `zip` Zip code

### Get hairdresser by ID

Method: `GET`<br>
Path: `/hairdressers/:id`

#### Parameters

`:id` The hairdresser ID to fetch data from

#### Example of API response

```js
{
	"status": 200,
    "payload": {
        "hairdresser": {
            "role": "SUPPLIER",
            "_id": "60a3cc59952dd1002a795c3c",
            "email": "supplier@test.com",
			"description": "Supplier account",
            "address": {
                "_id": "60afa5a7eb5d3c098b265462",
                "street": "Kungsgatan 34",
                "city": "Stockholm",
                "zip": 12345
            },
        }
    }
}
```

#### Fields in API response

-   `hairdresser` One hairdresser
    -   `role`
    -   `_id` Hairdresser ID
    -   `email`
    -   `description`
    -   `address`
        -   `_id` Address ID
        -   `street` Street name
        -   `city` City name
        -   `zip` Zip code

### Get hairdresser rating

Method: `GET`<br>
Path: `/hairdressers/:id/ratings`

#### Parameters

`:id` The hairdresser ID to fetch ratings from

#### Example of API response

```js
{
	"status": 200,
    "payload": {
        "ratings": [
            {
                "_id": "60af929f77e7b19661341165",
            	"madeBy": {
                    "role": "CUSTOMER",
                    "_id": "60a3d64ca927a100454cdf1d",
                    "email": "customer@test.com",
                    "address": {
                        "_id": "60abb7c0793da604b6a66f0c",
						"street": "Kungsgatan 34",
						"city": "Stockholm",
						"zip": 12345
                    },
                    "description": "Customer account"
                },
                "refersTo": "60a3cc42952dd1002a795c3b",
                "date": "2021-05-27T12:42:14.670Z",
                "value": 9
            }
        ],
        "average": 9
    }
}
```

#### Fields in API response

-   `ratings` List of ratings for the hairdresser
    -   `_id` Rating ID
    -   `madeBy` The user who made the rating
        -   `role`
        -   `_id` User ID
        -   `email`
        -   `address`
            -   `_id` Address ID
            -   `street` Street name
            -   `city` City name
            -   `zip` Zip code
        -   `address`
            -   `_id` Address ID
            -   `street` Street name
            -   `city` City name
            -   `zip` Zip code
        -   `description`
    -   `refersTo` The hairdresser ID the rating refers to
    -   `date` The date the rating was last updated
    -   `value` The rating value
-   `average` The average rating value for the hairdresser

### Authenticated routes

These routes require a bearer token to access.

---

### Get all users

Method: `GET`<br>
Path: `/users`

#### Example of API response

```js
{
	"status": 200,
	"payload": {
		"users": [
			{
				"role": "CUSTOMER",
				"_id": "60a3cc42952dd1002a795c3b",
				"email": "test@test.com",
				"description": "Short description",
				"address": {
					"_id": "60abb7c0793da604b6a66f0c",
                    "street": "Kungsgatan 34",
                    "city": "Stockholm",
					"zip": 12345
				}
			}
		]
	}
}
```

#### Fields in API response

-   `users` List of users
    -   `role`
    -   `_id` User ID
    -   `email`
    -   `description`
    -   `address`
        -   `_id` Address ID
        -   `street` Street name
        -   `city` City name
        -   `zip` Zip code

### Get user by ID

Method: `GET`<br>
Path: `/users/:id`

#### Parameters

`:id` The user ID to fetch data from

#### Example of API response

```js
{
	"status": 200,
	"payload": {
		"user": {
			"role": "CUSTOMER",
			"_id": "60a3cc42952dd1002a795c3b",
			"email": "test@test.com",
			"description": "Short description",
			"address": {
				"_id": "60abb7c0793da604b6a66f0c",
				"street": "Kungsgatan 34",
				"city": "Stockholm",
				"zip": 12345
			}
		}
	}
}
```

#### Fields in API response

-   `user` One user
    -   `role`
    -   `_id` User ID
    -   `email`
    -   `description`
    -   `address`
        -   `_id` Address ID
        -   `street` Street name
        -   `city` City name
        -   `zip` Zip code

### Get all ratings made by a user

Method: `GET`<br>
Path: `/users/:id/ratings`

#### Parameters

`:id` The user ID to fetch ratings from

#### Example of API response

```js
{
	"status": 200,
    "payload": {
        "user": {
            "role": "CUSTOMER",
            "_id": "60a3d64ca927a100454cdf1d",
            "email": "customer@test.com",
            "address": {
                "_id": "60abb7c0793da604b6a66f0c",
				"street": "Kungsgatan 34",
				"city": "Stockholm",
				"zip": 12345
            },
            "description": "Customer account"
        },
        "ratings": [
            {
                "_id": "60af929f77e7b19661341165",
                "madeBy": "60a3d64ca927a100454cdf1d",
                "refersTo": {
                    "role": "SUPPLIER",
                    "_id": "60a3cc42952dd1002a795c3b",
                    "email": "supplier@test.com",
                    "address": {
                        "_id": "60abb7c0793da604b6a66f0c",
						"street": "Kungsgatan 34",
						"city": "Stockholm",
						"zip": 12345
                    }
                },
                "date": "2021-05-27T12:42:14.670Z",
                "value": 9
            }
        ]
    }
}
```

#### Fields in API response

-   `user` The user who made the ratings
    -   `role`
    -   `_id` User ID
    -   `email`
    -   `address`
        -   `id` Address ID
        -   `street` Street name
        -   `city` City name
        -   `zip` Zip code
    -   description
-   `ratings` List of ratings made by the user
    -   `_id` Rating ID
    -   `madeBy` The user ID who made the rating
    -   `refersTo` The hairdresser it refers to
        -   `role`
        -   `_id` Hairdresser ID
        -   `email`
        -   `address`
            -   `_id` Address ID
            -   `street` Street name
            -   `city` City name
            -   `zip` Zip code
    -   `date` The date the rating was last updated
    -   `value` The rating value
