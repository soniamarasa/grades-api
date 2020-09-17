import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { db } from './models/index.js';
import { gradeRouter } from './routes/gradeRouter.js';
import dotenv from 'dotenv';
dotenv.config();

global.fileName = "grades.json";

(async () => {
  try {
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao mongodb');
  } catch (error) {
    console.log(process.env)
    console.log('erro ao conectar ao mongodb');
    process.exit();
  }
})();

const app = express();

//define o dominio de origem para consumo do servico
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
<<<<<<< HEAD
    origin: 'https://grade-api-front.herokuapp.com',
=======
    origin: 'http://localhost:3000',
>>>>>>> parent of 557d5bc... Ajusta cors e comando start heroku
  })
);

app.get('/', (req, res) => {
  res.send('API em execução');
});

app.use(gradeRouter);

app.listen(process.env.PORT, () => {
  console.log('API em execução')
});
