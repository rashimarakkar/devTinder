# DevTinder APIS

## authRouter

- POST  /signup
- POST /login
- POST /logout

## profileRouter

- GET /profile/view
- GET /profile/edit
- PATCH /profile/password

## connectionRequestRouter

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feeds - Gets all other users profiles on platform

Status: ignore, intrested, accepted, rejected
