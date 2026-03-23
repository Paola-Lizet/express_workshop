const express = require('express');
const pokemon = express.Router();
const db = require('../config/database');

pokemon.post("/", async (req, res, next) => {
    return res.status(200).send(req.body);
})

pokemon.get("/", async (req,res,next) => {
    const pkmn = await db.query("SELECT * FROM pokemon")
    return res.status(200).json(pkmn);
})

//Prof, tuve que modificar un poco el app.get (el siguiente)
//porque la versión que tengo ya no permite el "([0-9]{1,3)"
pokemon.get('/:id', async (req, res, next) => {
    const idParam = req.params.id;
    if (/^[0-9]{1,3}$/.test(idParam)) {
        const pkmn = await db.query("SELECT * FROM pokemon", [parseInt(idParam)]);
        if (pkmn.length>0) {
            return res.status(200).json(pkmn);
        }
        else {
            return res.status(404).send("Pokemon no encontrado");
        }
    }
    else {
        return next('route');
    }
});

//Lo mismo, tuve que modificar un poco el app.get
//porque la versión que tengo ya no permite el la forma del video
pokemon.get('/:name', async (req, res, next) => {
    const name = req.params.name;
    if (!/^[A-Za-z]+$/.test(name)) {
        return next();
    }
    const pkmn= await db.query("SELECT * FROM pokemon", [name]);
    if (pkmn.length>0) {
        return (p.name.toUpperCase() == name.toUpperCase()) && p;
    };
    (pkmn.length>0) ?
        res.status(200).json(pkmn) :
        res.status(404).send("Pokemon no encontrado")
});

module.exports = pokemon; 