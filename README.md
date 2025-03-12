# Note - Secure and Private Note-Taking App (Backend)

Welcome to Note, your personal, private, and secure note-taking app. This repository contains the backend API that powers the application.

## Features
- Secure and encrypted note storage
- Fast and lightweight API
- Easy database setup with Knex.js
- Environment-based configuration

## Installation
Follow these steps to set up and run the Note backend on your local machine.

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Knex.js](https://knexjs.org/) for database migrations
- A compatible database (PostgreSQL, MySQL, SQLite, etc.)

### Setup Guide
1. **Clone the Repository**
   ```sh
   git clone https://github.com/ethrythedev/note-backend.git
   cd note-backend
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Configure Environment Variables**
   - Copy the example configuration file:
     ```sh
     cp COPY-TO-.env .env
     ```
   - Open `.env` and update the settings as needed.

4. **Set Up the Database**
   - Initialize Knex.js:
     ```sh
     npx knex init
     ```
   - Run the latest database migrations:
     ```sh
     npx knex migrate:latest
     ```

5. **Start the Server**
   ```sh
   node .
   ```

## Usage
Once the server is running, you can interact with the API using tools like Postman or cURL. The API endpoints will allow you to create, retrieve, update, and delete notes securely.

## Contributing
Contributions are welcome! Feel free to submit issues or pull requests to improve the backend.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Enjoy your secure note-taking experience with **Note**! 🚀

