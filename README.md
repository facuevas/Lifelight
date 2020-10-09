# LIFELIGHT

A web application that lets users post status updates to others. Users can note if their update was a positive or negative experience. Every month, the application will give them a brief summary of the previous month in terms of how many positive or negative experiences they had. Currently put this project on pause due to current time constraints and commitments. For the most part, the back end works. Started to work on the front end before I had to pause with the project.

<br>

# TODO

- [] BACKEND
  - [X] Create Database Schemas
    - [X] Account Schema
    - [X] Lifelight Schema
  - [X] Express.js REST API
    - [X] Account Endpoints
      - [X] POST /v1/create_account -> creates a new account
      - [X] GET /v1/account/:id -> returns the users' overview
      - [X] PUT /v1/account/:id -> allows the user to edit their account settings
      - [X] DELETE /v1/account/:id -> allows the user to delete their account
      - [X] GET /v1/account/:id/friends -> returns the users' friends list
    - [X] Lifelight Endpoints
      - [X] POST /v1/create_lifelight -> creates a new lifelight
      - [X] GET /v1/account/lifelight/:id -> returns a users single lifelight by id
      - [X] GET /v1/account/lifelight -> returns a users overview of lifelights
      - [X] DELETE /v1/account/lifelight/:id -> deletes a user's lifelight by ID.
  
