# Media Streaming Backend

This is a backend service for a media streaming application. It provides APIs for user authentication, media management, watch history, watch progress, watchlist management, and media recommendations.

## Features

- **User Authentication**: Signup and login functionality with JWT-based authentication.
- **Media Management**: Upload, update, delete, and fetch media files. Supports video and audio files.
- **Watch History**: Track and manage user watch history.
- **Watch Progress**: Save and retrieve user watch progress.
- **Watchlist**: Add and remove media from the user's watchlist.
- **Recommendations**: Provide personalized media recommendations based on user watch history and preferences.
- **API Rate Limiting**: Prevent excessive API calls to improve security and efficiency.
- **Pagination**: Implement pagination for handling large datasets efficiently.
- **API Documentation**: Swagger-based API documentation.

--- 
## Deployment & Hosted Links

| Service      | Hosted Link |
|-------------|------------|
| **Backend API** | [https://media-streaming-backend-inyq.onrender.com](https://media-streaming-backend-inyq.onrender.com) |
| **Swagger Docs** | [https://media-streaming-backend-inyq.onrender.com/api-docs](https://media-streaming-backend-inyq.onrender.com/api-docs) |

---

## Project Structure

```plaintext
.env
.gitignore
config/
    cloudinary.js
    swagger.js
controllers/
    authController.js
    historyController.js
    mediaController.js
    recommendationController.js
    watchlistController.js
    watchProgressController.js
index.js
middleware.js
models/
    historyModel.js
    mediaModel.js
    recommendationModel.js
    userModel.js
    watchlistModel.js
    watchProgressModel.js
package.json
public/
    temp/
routes/
    authRoutes.js
    historyRoutes.js
    mediaRoutes.js
    recommendationRoutes.js
    watchlistRoutes.js
    watchProgressRoutes.js
utils/
    CatchAsync.js
    ExpressError.js    
```

```mermaid

graph TD;
    User[User] -->|Requests Media| Frontend[Clinikk TV Frontend];
    Frontend -->|API Call| Backend[Clinikk TV Backend (Node.js)];
    
    Backend -->|Fetches Data| Database[MongoDB];
    Backend -->|Retrieves Media URL| CloudStorage[Cloudinary];
    
    Backend -->|Saves Watch Progress| HistoryDB[History Collection (MongoDB)];
    
    Frontend -->|Streams Video| CloudStorage;
    Frontend -->|Sends Watch Progress Updates| Backend;
    
    Backend -->|Updates Watch History| HistoryDB;
    
    Admin[Admin User] -->|Uploads Media| Backend;
    Backend -->|Stores Media| CloudStorage;
    
    Backend -->|Authenticates| AuthService[JWT Auth Service];
    
    AuthService -->|Validates Users| Database;

```


## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account for media storage

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/media-streaming-backend.git
    ```
    ```sh
    cd media-streaming-backend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```
3. Start the server:

    ```sh
    node index.js
    ```


## Server Information
- The server will start on: `http://localhost:4000`
- API Documentation is available at: `http://localhost:4000/api-docs`

---

## Design Approach

### Authentication
- JWT-based authentication is used to secure the APIs.
- Middleware functions are used to authenticate users and restrict access to certain endpoints.

### Media Management
- Media files are first temporarily stored on the server.
- Once uploaded to **Cloudinary**, the files are deleted from the server.
- **Multer** is used for handling file uploads.
- Media metadata is stored in **MongoDB**.

### Watch History and Progress
- User watch history and progress are tracked and stored in **MongoDB**.
- APIs are provided to fetch, add, and delete watch history and progress.

### Watchlist
- Users can add and remove media from their watchlist.
- Watchlist data is stored in **MongoDB**.

### Recommendations
- Personalized media recommendations are generated based on user watch history and preferences.
- Recommendation data is stored in **MongoDB**.
- Machine learning algorithms can be integrated to improve recommendation accuracy.

### API Rate Limiting
- Rate limiting is implemented to prevent excessive API calls.
- **express-rate-limit** middleware is used to limit the number of requests per IP.

### Pagination
- Pagination is implemented to handle large datasets efficiently.
- **skip** and **limit** parameters are used to fetch paginated data.

### Error Handling
- Custom error handling middleware is used to handle errors and send appropriate responses.

---

## Dependencies
The following dependencies are used in this project:

| Package       | Description |
|--------------|-------------|
| `express`    | Web framework for Node.js |
| `mongoose`   | MongoDB object modeling tool |
| `jsonwebtoken` | For JWT-based authentication |
| `bcryptjs`   | For hashing passwords |
| `cloudinary` | For media storage |
| `multer`     | For handling file uploads |
| `dotenv`     | For loading environment variables |
| `swagger-jsdoc` | For generating Swagger documentation |
| `swagger-ui-express` | For displaying Swagger documentation |


---
