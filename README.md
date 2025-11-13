# \#already-knows

## Verify Backend
1. `npm install` in the backend.
1. Start the backend: `npm start`.
1. `npm install` in the frontend.
1. Start the frontend: `npm run dev`.
1. Access `http://localhost:5173` (or whichever port it assigned you) and you should have console message with `{title: "Express"}`.

## Set Up Your Database

1. Start the Docker image: `docker-compose up`. Make sure you have Docker Desktop running.
1. Start the backend: `npm start`
1. Access `http://localhost:3000/users/`. If your data node is an empty array, you should populate your database.
1. Execute `curl -X POST localhost:3000/users/load-from-file` in the terminal.
1. Now refresh `http://localhost:3000/users/` and you should see a JSON blob for 5 users.