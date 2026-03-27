const express = require('express');
const pokemon = express.Router();
const db = require('../config/database');

pokemon.post("/", async (req, res, next) => {
    const { pok_name, pok_height, pok_weight, pok_base_experience} = req.body;
    if(pok_name && pok_height && pok_weight && pok_base_experience){
        let query = "INSERT INTO pokemon(pok_name, pok_height, pok_weight, pok_base_experience)";
        query += `VALUES('${pok_name}',${pok_height},${pok_weight},${pok_base_experience})`;
        const rows = await db.query(query);
        if(rows.affectedRows==1){
            return res.status(201).json({code: 201, message: "Pokemon insertado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrió un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
        
});

pokemon.get("/", async (req,res,next) => {
    const pkmn = await db.query("SELECT * FROM pokemon")
    return res.status(200).json({code: 1, message: pkmn});
});

//Prof, tuve que modificar un poco el app.get (el siguiente)
//porque la versión que tengo ya no permite el "([0-9]{1,3)"
pokemon.get('/:id', async (req, res, next) => {
    const idParam = req.params.id;
    if (/^[0-9]{1,3}$/.test(idParam)) {
        const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_id = ?", [parseInt(idParam)]);
        if (pkmn.length>0) {
            return res.status(200).json({code: 200, message: pkmn});
        }
        else {
            return res.status(404).send({code: 404, message: "Pokemon no encontrado"});
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
    const pkmn= await db.query("SELECT * FROM pokemon WHERE pok_id = ?", [name]);
    if (pkmn.length > 0) {
            return res.status(200).json({code: 200, message: pkmn});
        } else {
            return res.status(404).send({code: 404, message: "Pokemon no encontrado"});
        }
});

module.exports = pokemon; 