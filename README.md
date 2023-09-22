# Task

In this challenge, you'll build on provided Mongoose models to create an API for a record store e-commerce application. You'll be adding a variety of routes for both albums and purchases.

## Albums

Add routes for these five CRUD actions pertaining to the Album model:

- `GET /albums` - Get a list of all albums in the database.
- `GET /albums/:id` - Return a single album record by id.
- `POST /albums` - Create a single album from the parameters passed in.
- `PUT /albums/:id` - Update an existing album record by id.
- `DELETE /albums/:id` - Delete an existing album by id.

### Requests

The POST and PUT routes should expect JSON values in the request body which will contain the values necessary for creating and saving a record. All three Album fields can be updated.

Both the GET and DELETE routes should expect an id which will be the id of an existing Album record.

### Response

Since this is a JSON API, return JSON and a 200 status code, with the exception of the destroy method which should return a 204 status code indicating no content.

All three Album columns title, performer, and cost should be returned in a data object for the GET, POST, and PUT methods. Here is an example of the format of response.body.data:

```json
response.body.data = {
  _id: "the id of the album",
  title: "Appetite for Destruction",
  performer: "Guns N' Roses",
  cost: 20
};
```

## Purchases

Add this single route pertaining to the Purchase model:

- `POST /purchases` - Create a purchase.

### Request

The POST `/purchases` route should expect user and album properties to be set in the request body. It should then store a reference to both of these records on the newly created purchase record.

### Response

The response for POST `/purchases` should include the purchase record as well as the user and album relations, which should be populated with all their data fields.

### Errors

For simplicity's sake, you may assume that all requests are valid.

There is no need to connect to MongoDB directly in the solution. The example test cases and the submission test cases are set up to connect to MongoDB.

Additionally, there's no need to call `app.listen`; the testing code will import your app directly.
