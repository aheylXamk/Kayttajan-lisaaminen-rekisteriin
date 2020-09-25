const mysql = require("mysql");
const crypto = require("crypto");


const yhteys = mysql.createConnection({
                                        "host" : "localhost",
                                        "user" : "root",
                                        "password" : "",
                                        "database" : "kayttajarekisteri"
                                       });


yhteys.connect((err) => {

    if (!err) {

        console.log("Yhteys tietokantapalvelimeen avattu!");

    } else {
    
       throw err; 
    
    }

    

});

module.exports = {

    "haeKaikki" : (callback) => {

        yhteys.query("SELECT * FROM kayttajat", (err, data) => {

            callback(err, data);

        });

    
    },

    "lisaaUusi" : (tiedot, callback) => {

        let sql = "INSERT INTO kayttajat (id, sukunimi, etunimi, sahkoposti, kayttajatunnus, salasana) VALUES (?, ?, ?, ?, ?, ?)";

        let tiiviste = crypto.createHash("SHA256").update(tiedot.salasana).digest("hex");

        yhteys.query(sql, [tiedot.id, tiedot.sukunimi, tiedot.etunimi, tiedot.sahkoposti, tiedot.kayttajatunnus, tiiviste], (err) => {

            callback(err);
        });
    },


    "muokkaaKayttajaa" : (tiedot, callback) => {

        let sql = "UPDATE kayttajat SET sukunimi = ?, etunimi = ?, sahkoposti = ?, kayttajatunnus = ?, salasana = ? WHERE id = ?";

        let sqlII = "UPDATE kayttajat SET sukunimi = ?, etunimi = ?, sahkoposti = ?, kayttajatunnus = ? WHERE id = ?";

        let uusiSalasana = tiedot.salasana;

        let tiiviste = crypto.createHash("SHA256").update(tiedot.salasana).digest("hex");

        if (uusiSalasana.length == 0) {

            yhteys.query(sqlII, [tiedot.sukunimi, tiedot.etunimi, tiedot.sahkoposti, tiedot.kayttajatunnus, tiedot.id], (err) => {

                callback(err);            
    
            });


        } else {

            yhteys.query(sql, [tiedot.sukunimi, tiedot.etunimi, tiedot.sahkoposti, tiedot.kayttajatunnus, tiiviste, tiedot.id], (err) => {

                callback(err);            
    
            });

        }

        
    },

    "poistaKayttaja" : (tiedot, callback) => {

        let sql = "DELETE FROM kayttajat WHERE id = ?";

        yhteys.query(sql, [tiedot.id], (err) => {

            callback(err);
        });
    }

}