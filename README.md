# Support Local Backend

Support Local is THE one-stop shop for all things local. It compiles all local businesses, and services in an easy-to-use portal and allows them to offer their products and services to customers through the platform.

Main App: https://supportlocal.netlify.app/

Backend hosted on Heroku: https://support-local.herokuapp.com/

Backend Stack: Express, Node.js, MongoDB

## Project setup
Download project repository to your local directory:
```
git clone git@github.com:WAD2-T05/support-local-backend.git
```
Open your terminal in local project, and execute:
```
npm install
``` 
Add `.env.local` file and configure database connection
```
MONGODB_URI=mongodb+srv://<DB_USERNAME>:<DB_PASSWORD>@cluster0.zlomb.mongodb.net/<DB_NAME>?retryWrites=true&w=majority
PORT=3001
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Lints and fixes files
```
npm run lint
```

You may make API calls to the server locally via `localhost:3001`.

## Entity-Relationship Diagram
