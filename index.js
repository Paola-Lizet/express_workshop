const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const { pokemon } = require('./pokedex.json');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
    return res.status(200).send("Bienvenido al Pokedex");
});

app.post("/pokemon", (req, res, next) => {
    return res.status(200).send(req.body);
})

app.get("/pokemon", (req,res,next) => {
    return res.status(200).send(pokemon);
})


//Prof, tuve que modificar un poco el app.get (el siguiente)
//porque la versión que tengo ya no permite el "([0-9]{1,3)"
app.get('/pokemon/:id', (req, res, next) => {
    const idParam = req.params.id;
    if (/^[0-9]{1,3}$/.test(idParam)) {
        const id = parseInt(idParam) - 1;
        if (pokemon[id]) {
            return res.status(200).send(pokemon[id]);
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
app.get('/pokemon/:name', (req, res, next) => {
    const name = req.params.name;
    if (!/^[A-Za-z]+$/.test(name)) {
        return next(); 
    }
    const pk= pokemon.filter((p) => {
        return (p.name.toUpperCase() == name.toUpperCase()) && p;
    });
    (pk.length>0) ?
        res.status(200).send(pk) : 
        res.status(404).send("Pokemon no encontrado")

})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...")
})