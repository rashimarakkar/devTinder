# DevTinder APIS

## Auth Router

- POST  /signup
- POST /login
- POST /logout

## Profile Router

- GET /profile/view
- GET /profile/edit
- PATCH /profile/password

## Connection Request Router

- POST /request/send/:status/:userId

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## User Router

- GET /user/connections
- GET /user/requests
- GET /user/feeds - Gets all other users profiles on platform

Status: ignore, intrested, accepted, rejected
