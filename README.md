# Node JS Server for responding to User signup and sign requests.

An Express based NodeJS server that responds to the user signup and signin requests.

## In order to use this server,

1. Open your terminal and type " git clone https://github.com/dev-umang-mittal/node-assignment.git "
2. cd into the folder and run " npm start "
3. Send API requests to the localhost:8080

## API Requests

### To get all users [GET]

> /allusers

###

Response

```json
[
  {
    "id": 0,
    "username": "ABC",
    "email": "abc@email.com",
    "password": "password"
  },
  {
    "id": 1,
    "username": "ABCD",
    "email": "abcd@email.com",
    "password": "password"
  }
]
```

### To get a user with a specific id [GET]

> /user/0 {0 is the id}

###

Response

```json
{
  "id": 0,
  "username": "ABC",
  "email": "abc@email.com",
  "password": "password"
}
```

### To create a user [POST]

> /user

###

Body to be sent

```json
{
  "username": "ABC",
  "email": "abc@email.com",
  "password": "password"
}
```

### Edit the details of a user [PUT]

> /user/0 {0 is the id}

###

Body to be sent

```json
{
  "edit": {
    "username": "ABCD",
    "Only the Fields": "To be changed"
  }
}
```

### Delete a user [DELETE]

> user/0 {0 is the id}

### Login [POST]

> login/

###

Body to be sent

```json
{
  "email": "abc@email.com",
  "password": "password"
}
```
