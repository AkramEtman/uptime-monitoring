## Description

Uptime Monitoring RESTful API server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, average response time, and total uptime/downtime

## Getting started

1. Start the service 
    ```bash
    docker-compose up
    ```

1. Open Swaggers UI at <http://localhost:3000/api>.

## Test

```bash
# unit tests
$ npm run test

```

## Basic Concepts

* Uptime Monitoring was built with 
  * MongoDb
  * Bull Queue ( based on `Redis` ) 
  * Swagger for API Docs
  * Axios as Promise based HTTP client
  * JWT and Passport as Authentication middleware

* Notification Module was based on Strategy pattern

> To add new Notidication service

1. create new class and implements NotificationStrategy Interface
2. add class reference to NotificationStrategy object in `src/notifications/utils/enum` file
3. add class name to NotificationType enum in `src/notifications/utils/enum` file


> **Warning** To make sure that email alerts received, please insure to change email config in env in Dockerfile 


* on Application Bootstrap, Checks Module get all active checks and add intervals for them
* User can easily pause check through change `active` attribute to `false` in check document
