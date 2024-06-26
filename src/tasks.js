
const express = require("express");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger-output.json");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;
const secretKey = "sht";

/**
 * 
 * MIDDLEWARE
 * 
 */
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(session({
    secret: "modul295",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));


/**
* 
* TASKS
* 
**/

/*
TEST DATEN
*/
let tasks = [
    {
        "ID": "1",
        "Titel": "Einkauf erledigen",
        "Beschreibung": "Einkaufsliste erstellen und Lebensmittel besorgen",
        "Done": false,
        "DueDate": "2024-06-10"
    },
    {
        "ID": "2",
        "Titel": "Arbeitsbericht schreiben",
        "Beschreibung": "Bericht über die Projektfortschritte verfassen und an das Team senden",
        "Done": true,
        "DueDate": "2024-06-15"
    },
    {
        "ID": "3",
        "Titel": "Geburtstagsgeschenk besorgen",
        "Beschreibung": "Ein passendes Geschenk für den Geburtstag von Alex finden und kaufen",
        "Done": false,
        "DueDate": "2024-06-20"
    },
    {
        "ID": "4",
        "Titel": "Fitnessstudio anmelden",
        "Beschreibung": "Online anmelden und den ersten Trainingsplan erstellen",
        "Done": false,
        "DueDate": null
    },
];



/*
TASKS ENDPOINTS
*/
app.get("/tasks", (req, res) => {
    const tasksList = tasks.map(task => ({ ID: task.ID, Titel: task.Titel, Beschreibung: task.Beschreibung, Done: task.Done, DueDate: task.DueDate }));
    res.json(tasksList);
});

app.post("/tasks", (req, res) => {
    const newTask = req.body;

    if (!newTask.ID) {
        return res.status(422).json({ error: "Eine ID ist nötig" });
    }
    if (!newTask.Titel) {
        return res.status(422).json({ error: "Ein Titel ist nötig" });
    }

    tasks.push(newTask);
    res.status(201).json(newTask);
});


app.get("/tasks/:ID", (req, res) => {
    const ID = req.params.ID
    const task = tasks.find(task => task.ID == ID);
    if (!task) {
        return res.status(404).json({ error: "Task nicht gefunden" });
    }
    res.json(task);
});

app.delete("/tasks/:ID", (req, res) => {
    const ID = req.params.ID
    const index = tasks.findIndex(task => task.ID == ID);
    if (index === -1) {
        return res.status(404).json({ error: "Task nicht gefunden" });
    }

    tasks.splice(index, 1);
    res.sendStatus(204);
});

app.patch("/tasks/:ID", (req, res) => {
    const ID = req.params.ID
    const updates = req.body;
    const index = tasks.findIndex(task => task.ID == ID);

    if (index === -1) {
        return res.status(404).json({ error: "Task nicht gefunden" });
    }

    if (Object.keys(updates).length === 0) {
        return res.status(422).json({ error: "Es muss mindestens 1 Wert angegeben werden" });
    }

    if (updates.ID) {
        tasks[index].ID = updates.ID;
    }
    if (updates.Titel) {
        tasks[index].Titel = updates.Titel;
    }
    if (updates.Beschreibung) {
        tasks[index].Beschreibung = updates.Beschreibung;
    }
    if (updates.Done) {
        tasks[index].Done = updates.Done;
    }
    if (updates.DueDate) {
        tasks[index].DueDate = updates.DueDate;
    }

    res.json(tasks[index]);
});


/**
* 
* AUTHENTIFICATION
* 
**/

/*
MIDDLEWARE TOKEN
*/
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ error: "Kein Token bereitgestellt" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Ungültiges Token" });
        }
        req.user = decoded; 
        next();
    });
}

app.use((req, res, next) => {
    if (req.path !== "/login" && req.path !== "/verify") {
        verifyToken(req, res, next);
    } else {
        next();
    }
});


/*
AUTHENTIFICATION ENDPOINTS
*/
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (password === "m295") {
        const secretKey = "sht";

        function generateToken(email) {
            return jwt.sign({ email }, secretKey);
        }

        const token = generateToken(email);
        return res.status(200).json({ token });
    }
    return res.status(401).json({ error: "Falsche Credentials" })
});

app.get("/verify", (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Authentifizierung nicht möglich" });
    }


    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Ungültiges Token" });
        } else {
            return res.status(200).json({ message: "Token gültig", decodedToken: decoded });
        }
    });

    
});

app.delete("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.sendStatus(204);
    });
});

/* 
SERVER CONSLE LOG 
*/
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


