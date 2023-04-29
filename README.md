# Nodejs, Apollo Server Express, GraphQL, Elasticsearch, Typescript, Socket, Nodemailer, AWS startup

A startup project using the tech stack:

- Nodejs
- Apollo Server Express
- GraphQL
- Elasticsearch
- Typescript
- Socket
- Nodemailer
- AWS

<div id="top"></div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#setup">Setup</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The API provider of Trends Dashboard Frontend

### Built With

- [Elasticsearch](https://www.elastic.co/) - The fast and scalable search and analytics engine.
- [Aws-sdk](https://www.npmjs.com/package/aws-sdk) - The SDK of AWS.
- [Typescript](https://www.typescriptlang.org/) - TypeScript is a strongly typed programming language that builds on
  JavaScript

<!-- GETTING STARTED -->

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing
purposes.

### Prerequisites

- Node.js
- yarn (or npm)

### Installation

1. Clone the repository

   ```shell
   git clone https://github.com/ocxers/nodejs-apolloserverexpress-graphql-elasticsearch-typescript-socket-nodemailer-aws.git
   ```

2. Install dependencies

   ```shell
   yarn
   ```

   or

   ```shell
   npm install
   ```

3. Start the development server

   ```shell
   yarn dev
   ```
   or
   ```shell
   npm run dev
   ```
4. Open http://localhost:4007 in your browser to see the app running.

### Setup

When you have proxy the elasticsearch server to your local, please setup `.env` file:

```shell
...
ES_URL="http://localhost:9200"
ES_HOST="http://localhost:9200"
...
```

## Contributing

1. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
2. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## Contact

- ocxers - ocxers@gmail.com
