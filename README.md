
# Hypno-Buddy (In progress)

This is our Hypno-Buddy project. So far we've setup basic backend. Further info to be added.

Our tech stack (so far):
- Design patterns:
    - MVC
- UI Design:
    - Figma    
- Frontend:
    - React
    - Bootstrap
- Backend:
    - TypeScript
    - Node.js
    - Express
- Database:
    - Mongo DB
## TODOs and info

This README is created using readme.so, an editor, which can be further used for templates to expand our README.

- [ ]  Fill the API reference and tests section
## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.


## Running Tests

To run tests, run the following command

```bash
  npm run test
```

