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

//Igual este lo modifiqué
pokemon.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    if (!/^[0-9]{1,3}$/.test(id)) {
        return next('route'); 
    }
    const query = `DELETE FROM pokemon WHERE pok_id=${id}`;
    const rows=await db.query(query);
    if (rows.affectedRows == 1) {
        return res.status(200).json({code: 200, message: "Pokemon borrado correctamente"});
    }
    return res.status(404).json({code: 404, message: "Pokemon no encontrado"});
});

//Igual modifiqué este un poquito
pokemon.put("/:id", async (req, res, next) => {
    const id = req.params.id;
    if (!/^[0-9]{1,3}$/.test(id)) {
        return next('route'); 
    }

    const { pok_name, pok_height, pok_weight, pok_base_experience} = req.body;

    if(pok_name && pok_height && pok_weight && pok_base_experience){
        let query = `UPDATE pokemon SET pok_name='${pok_name}', pok_height=${pok_height},`;
        query+= `pok_weight=${pok_weight},pok_base_experience=${pok_base_experience} WHERE pok_id=${req.params.id};`;
        const rows = await db.query(query);

        if(rows.affectedRows==1){
            return res.status(200).json({code: 200, message: "Pokemon actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrió un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

pokemon.patch("/:id", async (req, res, next) => {
    const id = req.params.id;
    if (!/^[0-9]{1,3}$/.test(id)) {
        return next('route'); 
    }
    if (req.body.pok_name) {
        let query = `UPDATE pokemon SET pok_name='${req.body.pok_name}' WHERE pok_id=${id}`;
        const rows = await db.query(query);
        if(rows.affectedRows == 1){
            return res.status(200).json({code: 200, message: "Pokemon actualizado correctamente"});
        }
        return res.status(500).json({code: 500, message: "Ocurrió un error"});
    }
    
    return res.status(500).json({ code: 500, message: "Campos incompletos"});
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