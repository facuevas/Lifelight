# LIFELIGHT

A mobile application that lets users post status updates to others. Users can note if their update was a positive or negative experience. Every month, the application will give them a brief summary of the previous month in terms of how many positive or negative experiences they had.

<br>

# TODO

- [] BACKEND
  - [X] Create Database Schemas
    - [X] Account Schema
    - [X] Lifelight Schema
  - [] Express.js REST API
    - [] Account Endpoints
      - [] POST /v1/create_account -> creates a new account
      - [] GET /v1/account/:id -> returns the users' overview
      - [] PUT /v1/account/:id -> allows the user to edit their account settings
      - [] DELETE /v1/account/:id -> allows the user to delete their account
      - [] GET /v1/account/:id/friends -> returns the users' friends list
    - [] Lifelight Endpoints
      - [] POST /v1/create_lifelight -> creates a new lifelight
      - [] GET /v1/account/lifelight/:id -> returns a users single lifelight by id
      - [] GET /v1/account/lifelight -> returns a users overview of lifelights
      - [] DELETE /v1/account/lifelight/:id -> deletes a user's lifelight by ID.
  