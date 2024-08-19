# CH 3 - Blog Post API

This project is a backend API for managing blog posts. It allows users to perform CRUD (Create, Read, Update, Delete) operations on blog posts.

## Features

- **Get a list of posts**: Retrieve a list of all blog posts.
- **Get a single post**: Retrieve details of a specific blog post by its ID.
- **Create a new post**: Add a new blog post to the database.
- **Update an existing post**: Modify the details of an existing blog post.
- **Delete an existing post**: Remove a blog post from the database.

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /posts`: Get a list of all posts.
- `GET /posts/:id`: Get a single post by ID.
- `POST /posts`: Create a new post.
- `PUT /posts/:id`: Update an existing post by ID.
- `DELETE /posts/:id`: Delete a post by ID.

## Contributing

Feel free to submit issues or pull requests if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the MIT License.
