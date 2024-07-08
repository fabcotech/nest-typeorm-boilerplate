## NestJS, TypeORM and postgreSQL boilerplate

I've build many NestJS + PostgreSQL projects, this is a boilerplate to be used
and/or extended by anyone who wants to 😀🎈⭐⭐.

It includes :

- Nest JS + TypeORM + postgreSQL all setup and ready to be extended
- A github continuous integration that lint + build + test
- Simple email/password auth API on `POST /auth/signup` and `POST /auth/login`
- PostgreSQL database set up with two tables (`user` and `session`)
- Sequantial test suite working with jest

Run postgreSQL in docker

```sh
docker compose --file docker-pg.yml up
```

```sh
# copy .env.example to .env

# have postgreSQL running on localhost:5432
# eventually create a postgreSQL database
# CREATE DATABASE nesttypeorm;

# This script will create DB from .env and db/dump
node createAndPopulate.js

yarn
yarn migration:run
yarn start:dev
yarn test
```
