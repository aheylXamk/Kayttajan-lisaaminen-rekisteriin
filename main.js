const restify = require("restify");

const server = restify.createServer();

const corsMiddleware = require("restify-cors-middleware");

const cors = corsMiddleware({
                                "origins" : [ "http://localhost", "http://t10client.herokuapp.com" ]
                            });

const kayttajat = require("./models/kayttajarekisteri");

const portti = 3110;

server.use(restify.pre.sanitizePath());
server.pre(cors.preflight);
server.use(restify.plugins.bodyParser());
server.use(cors.actual);


server.get("/api/kayttajat", (req, res, next) => {

    kayttajat.haeKaikki((err, data) => {

        if (!err) {

            res.send(data); 
            

        } else {

            res.send("ERROR");

        }

        return next();


    });
    
});

server.post("/api/kayttajat", (req, res, next) => {

    kayttajat.lisaaUusi(req.body, (err, data) => {

        if (!err) {

            res.send(200, {"status" : "Tiedot tallennettu"});
            
        } else {

            res.send(500, {"virhe" : "Tietoa ei voitu tallentaa!"});

        }

        return next();
    });

});

server.put("/api/kayttajat/:id", (req, res, next) => {

    kayttajat.muokkaaKayttajaa(req.body, (err, data) => {

        if (!err) {

            res.send(200, {"status" : "Tiedot tallennettu"});


        } else {

            res.send(500, {"virhe" : "Tietoa ei voitu tallentaa!"});

        }

        return next();
    });

});



server.del("/api/kayttajat/:id", (req, res, next) => {

    kayttajat.poistaKayttaja(req.params.id, (err, data) => {

        
        if (!err) {

            res.send(200, {"status" : "Muutos tallennettu"});

        } else {

            res.send(500, {"virhe" : "Muutosta ei voitu tallentaa"});

        }

        return next();
    });

});

server.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin ${portti}`);


});