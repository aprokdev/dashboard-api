import express from 'express';
import chalk from 'chalk';
import { userRouter } from './users/index.js';

const port = 8000;
const app = express();

app.use((req, res, next) => {
    console.log(`Time: ${Date.now()}`);
    next();
})

// app.get('/hello', (req, res, next) => {
//     res.send({ success: true });
//     next();
// });

app.get('/hello', (req, res, next) => {
    throw new Error('Error!!!')
});

app.use('/users', userRouter);

app.use((error, req, res, next) => {
    console.log(error.message);
    res.status(501).send(error.message)
})
// app.use((err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })

app.listen(port, () => {
    console.log(chalk.bgGreen(`Server has been started on https://localhost:${port}`));
});
// import http from "http";

// const host = "127.0.0.1";
// const port = 8000;

// const server = http.createServer((req, res) => {
//   switch (req.method) {
//     case "GET":
//       switch (req.url) {
//         case "/hello":
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "text/plain");
//           res.end("Hello!");
//           break;
//       }
//       break;
//   }
// });

// server.listen(port, host, () => {
//   console.log(`Server has been started on ${host}${port}`);
// });
