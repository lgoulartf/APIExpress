const express = require('express');
const connection = require('./connection');
const validateGame = require('./validateGame');
const teste = require('./test');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Games API',
      version: '1.0.0'
    }
  },
  apis: ['./index.js']
};

const openapiSpecification = swaggerJsdoc(options);
console.log(openapiSpecification);

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

/**
 * @swagger
 * /games:
 *  get:
 *    description: Get all Games
 *    responses:
 *      200:
 *        description: Ok
 */
app.get('/games', async (req, res) => {
  const [result] = await connection.execute('SELECT * FROM games');
  res.status(200).json(result);
  console.log(result);
});

/**
 * @swagger
 * /games:
 *  post:
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: game
 *        in: body
 *        required: true
 *        schema: 
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            release_year:
 *              type: number
 *            sinopsis:
 *              type: string
 *    responses:
 *      201:
 *        description: Created
 */
app.post('/games', validateGame, async (req, res) => {
  const { name, release_year, sinopsis } = req.body;
  const [result] = await connection.execute('INSERT INTO games (name, release_year, sinopsis) VALUES(?, ?, ?)', [name, release_year, sinopsis]);

  const newGame = {
    id: result.insertId,
    name,
    release_year,
    sinopsis
  };

  res.status(201).json(newGame);
});

app.get('/games/:id', async (req, res) => {
  const { id } = req.params;
  const [result] = await connection.execute('SELECT * FROM games WHERE id = ?', [id]);

  /* if (result.length === 0) {
    return res.status(404).json({ message: 'Jogo não encontrado.' });
  } */

  res.status(200).json(result);
});

app.listen(3001, () => {
  console.log('Rodando na porta 3001');
});