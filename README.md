<p align="center">
  <img src="./src/public/favicon.ico" alt="sqn" width="100" />
</p>

<h1 align="center">Express Typescript Boilerplate</h1>
</p>

## ❯ Table of Contents

- [Getting Started](#-getting-started)
- [Run using docker-compose](#-run-using-docker-compose)
- [Scripts and Tasks](#-scripts-and-tasks)
- [Debugger in VSCode](#-debugger-in-vscode)
- [API Routes](#-api-routes)
- [Project Structure](#-project-structure)
- [Kubernetes](#-kubernetes)
- [License](#-license)

![divider](./src/public/divider.png)

## ❯ Getting Started

### Step 1: Set up the Development Environment

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`

Install yarn globally

```bash
yarn install yarn -g
```
Pull the Postgres Docker image

```bash
docker pull postgres:latest
```

Run the Postgres Docker image

```bash
docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres
```

### Step 2: Setup environment

Copy the content of the .env.example to .env

Make sure the Postgres config reflect the following: (Needs to connect to the postges docker image)

```
#
# PostgreSQL DATABASE
#
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=password
TYPEORM_DATABASE=postgres
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=error
TYPEORM_LOGGER=advanced-console
```

### Step 3: Create new Project

Fork or download this project. Configure your package.json for your new project.

Then copy the `.env.example` file and rename it to `.env`. In this file you have to add your database connection information.

Create a new database with the name you have in your `.env`-file.

Then setup your application environment.

```bash
yarn run setup
```

> This installs all dependencies with yarn. After that it migrates the database and seeds some test data into it. So after that your development environment is ready to use.

### Step 4: Serve the application

Build the code

```bash
yarn build 
```

Serve the application

```bash
yarn start serve
```
![divider](./src/public/divider.png)
## ❯ Run using docker-compose

docker-compose.yml (MySQL)

```yml
version: '3.6'
services:
    mysql:
        container_name: mysql-docker
        image: mysql
        ports:
            - '3306:3306'
        restart: always
        logging:
            driver: 'json-file'
            options:
                max-size: '1m'
                max-file: '1'
        environment:
            - MYSQL_ROOT_PASSWORD=password
            - MYSQL_DATABASE=mysql-ms
            - MYSQL_USER=root
            - MYSQL_PASSWORD=password
        volumes:
            - $HOME/docker/volumes/mysql-ms:/var/lib/mysql
        command: ['mysqld', '--character-set-server=utf8mb4', '--collation-server=utf8mb4_unicode_ci', '--default-authentication-plugin=mysql_native_password']
```

docker-compose.yml (Postgres)

```yml
version: '3.6'
services:
    postgres:
            container_name: pg-docker
            image: postgres
            ports:
                - '5432:5432'
            restart: always
            logging:
                driver: 'json-file'
                options:
                    max-size: '1m'
                    max-file: '1'
            environment:
                - POSTGRES_PASSWORD=password
                - POSTGRES_DB=postgres-ms
            volumes:
                - $HOME/docker/volumes/postgres-ms:/var/lib/postgresql/data
```

docker-compose.yml (Microservice)

```yml
version: '3.6'
services:
    microservice-node:
            container_name: microservice-node-express
            image: sqn-microservice:latest
            ports:
                - '3000:3000'
            restart: always
            logging:
                driver: 'json-file'
                options:
                    max-size: '1m'
                    max-file: '1'
            environment:
                - TYPEORM_HOST=postgres
                - TYPEORM_DATABASE=postgres-ms
            links:
                - postgres
```

Build the image locally

```bash
docker build -t spn-microservice .
```

Run docker-compose command
```bash
docker-compose up -d
```

![divider](./src/public/divider.png)

## ❯ Scripts and Tasks

All script are defined in the `package-scripts.js` file, but the most important ones are listed here.

### Install

- Install all dependencies with `yarn install`

### Linting

- Run code quality analysis using `yarn start lint`. This runs tslint.
- There is also a vscode task for this called `lint`.

### Tests

- Run the unit tests using `yarn start test` (There is also a vscode task for this called `test`).
- Run the integration tests using `yarn start test.integration`.
- Run the e2e tests using `yarn start test.e2e`.

### Running in dev mode

- Run `yarn start serve` to start nodemon with ts-node, to serve the app.
- The server address will be displayed to you as `http://0.0.0.0:3000`

### Building the project and run it

- Run `yarn start build` to generated all JavaScript files from the TypeScript sources (There is also a vscode task for this called `build`).
- To start the builded app located in `dist` use `yarn start`.

### Database Migration

- Run `typeorm migration:create -n <migration-file-name>` to create a new migration file.
- Try `typeorm -h` to see more useful cli commands like generating migration out of your models.
- To migrate your database run `yarn start db.migrate`.
- To revert your latest migration run `yarn start db.revert`.
- Drops the complete database schema `yarn start db.drop`.

### Database Seeding

- Run `yarn start db.seed` to seed your seeds into the database.

![divider](./src/public/divider.png)

## ❯ Debugger in VSCode

To debug your code run `yarn start build` or hit <kbd>cmd</kbd> + <kbd>b</kbd> to build your app.
Then, just set a breakpoint and hit <kbd>F5</kbd> in your Visual Studio Code.

![divider](./src/public/divider.png)

## ❯ API Routes

The route prefix is `/api` by default, but you can change this in the .env file.
The swagger and the monitor route can be altered in the `.env` file.

| Route          | Description |
| -------------- | ----------- |
| **/api**       | Shows us the name, description and the version of the package.json |
| **/graphql**   | Route to the graphql editor or your query/mutations requests |
| **/swagger**   | This is the Swagger UI with our API documentation |
| **/monitor**   | Shows a small monitor page for the server |
| **/api/users** | Example entity endpoint |
| **/api/pets**  | Example entity endpoint |

![divider](./src/public/divider.png)

## ❯ Project Structure

| Name                              | Description |
| --------------------------------- | ----------- |
| **.vscode/**                      | VSCode tasks, launch configuration and some other settings |
| **dist/**                         | Compiled source files will be placed here |
| **src/**                          | Source files |
| **src/api/controllers/**          | REST API Controllers |
| **src/api/controllers/requests**  | Request classes with validation rules if the body is not equal with a model |
| **src/api/controllers/responses** | Response classes or interfaces to type json response bodies  |
| **src/api/errors/**               | Custom HttpErrors like 404 NotFound |
| **src/api/interceptors/**         | Interceptors are used to change or replace the data returned to the client. |
| **src/api/middlewares/**          | Express Middlewares like helmet security features |
| **src/api/models/**               | Bookshelf Models |
| **src/api/repositories/**         | Repository / DB layer |
| **src/api/services/**             | Service layer |
| **src/api/subscribers/**          | Event subscribers |
| **src/api/validators/**           | Custom validators, which can be used in the request classes |
| **src/api/resolvers/**            | GraphQL resolvers (query, mutation & field-resolver) |
| **src/api/types/**                | GraphQL types ,input-types and scalar types |
| **src/api/** schema.gql           | Generated GraphQL schema |
| **src/api/** swagger.json         | Swagger documentation |
| **src/auth/**                     | Authentication checkers and services |
| **src/core/**                     | The core features like logger and env variables |
| **src/database/factories**        | Factory the generate fake entities |
| **src/database/migrations**       | Database migration scripts |
| **src/database/seeds**            | Seeds to create some data in the database |
| **src/decorators/**               | Custom decorators like @Logger & @EventDispatch |
| **src/loaders/**                  | Loader is a place where you can configure your app |
| **src/public/**                   | Static assets (fonts, css, js, img). |
| **src/types/** *.d.ts             | Custom type definitions and files that aren't on DefinitelyTyped |
| **test**                          | Tests |
| **test/e2e/** *.test.ts           | End-2-End tests (like e2e) |
| **test/integration/** *.test.ts   | Integration test with SQLite3 |
| **test/unit/** *.test.ts          | Unit tests |
| .env.example                      | Environment configurations |
| .env.test                         | Test environment configurations |
| mydb.sql                          | SQLite database for integration tests. Ignored by git and only available after integration tests |

![divider](./src/public/divider.png)

## ❯ Kubernetes

First we need to create a secret object using the following command:

```bash
kubectl create secret generic mysql-pass --from-literal=password=YOUR_PASSWORD
```
(Replace 'YOUR_PASSWORD' with something else)

Next we run the deployment.yaml. This will orchestrate MySQL db as well as the node express microservice.  

```bash
kubectl create -f deployment.yaml
```

![divider](./src/public/divider.png)

## ❯ License

[MIT](/LICENSE)
