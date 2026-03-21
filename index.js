const express = require("express");
const app = express();
const { pokemon } = require('./pokedex.json');

app.get("/", (req, res, next) => {
    res.status(200);
    res.send("Bienvenido al Pokedex");
});

app.get("/pokemon/all", (req,res,next) => {
    res.status(200);
    res.send(pokemon);
})

//Prof, tuve que modificar un poco el app.get (el siguiente)
//porque la versión que tengo ya no permite el "([0-9]{1,3)"
app.get('/pokemon/:id', (req, res, next) => {
    const idParam = req.params.id;
    if (/^[0-9]{1,3}$/.test(idParam)) {
        const id = parseInt(idParam) - 1;
        if (pokemon[id]) {
            res.status(200)
            res.send(pokemon[id]);
        }
        else {
            res.status(404)
            res.send("Pokemon no encontrado");
        }
    } 
    else {
        return next('route');
    }
});
 
app.get('/pokemon/:name', (req, res, next) => {
    const name = req.params.name; 
    for(i=0; i<pokemon.length; i++){
        if(pokemon[i].name==name){
            res.status(200);
            res.send(pokemon[i]);
        }
    }
    res.status(404);
    res.send("Pokemon no encontrado");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});