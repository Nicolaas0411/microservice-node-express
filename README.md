<p align="center">
  <img src="./src/public/favicon.ico" alt="sqn" width="100" />
</p>

<h1 align="center">Express Typescript Boilerplate</h1>
</p>


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

Make sure the Postgres config reflect the following:

```
#
# PostgreSQL DATABASE
#
TYPEORM_CONNECTION=postgres
TYPEORM_HOST=localhost
TYPEORM_PORT=5432
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=docker
TYPEORM_DATABASE=postgres
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=error
TYPEORM_LOGGER=advanced-console
```

Run the database migration:

```bash
yarn start db.migrate
```

Seed some records to the database:

```bash
yarn start db.seed
```

### Step 3: Serve the application

Build the code

```bash
yarn build 
```

Serve the application

```bash
yarn start serve
```

![divider](./src/public/divider.png)