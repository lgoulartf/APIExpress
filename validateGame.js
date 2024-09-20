const joi = require('joi');

const GAME = joi.object({
    name: joi.string().min(3).required(),
    release_year: joi.number().integer().required(),
    sinopsis: joi.string().min(10).required()
});

function validateGame(req, res, next) {
    const {name, release_year, sinopsis} = req.body;

    const { error } = GAME.validate({ name, release_year, sinopsis });

    if (error) {
        return res.status(400).json({ message: 'Formato dos dados incorreto' });
    }

    next();
}

module.exports = validateGame;