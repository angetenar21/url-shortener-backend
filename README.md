URL Shortener API (Backend)

A lightweight RESTful API built with Node.js, Express, and MongoDB Atlas for creating and managing shortened URLs.

Features
	•	Create short URLs
	•	Retrieve original URLs
	•	Update existing URLs
	•	Delete URLs
	•	Track access statistics
	•	Auto-increment access count on each visit

Tech Stack

Node.js, Express.js, MongoDB Atlas (Mongoose), Render (deployment)

Project Structure

server.js, models (Url.js), routes (urlRoutes.js), utils (shortcode generator)

Environment Variables

Requires MONGO_URI and PORT in a .env file.

Endpoints

POST /shorten – create a short URL
GET /shorten/:shortCode – get original URL
PUT /shorten/:shortCode – update URL
DELETE /shorten/:shortCode – delete URL
GET /shorten/:shortCode/stats – view statistics

Deployment

Backend deployed on Render and connected to MongoDB Atlas.

project url: https://roadmap.sh/projects/url-shortening-service
