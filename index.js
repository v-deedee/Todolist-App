import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

db.connect();

async function getWorkdayTasks() {
    const tasks = await db.query("SELECT * FROM workday ORDER BY id;");
    return tasks.rows;
};

async function getDayoffTasks() {
    const tasks = await db.query("SELECT * FROM dayoff ORDER BY id");
    return tasks.rows;
}

let add = "";
let modify = "";

// let workday_tasks = [
//     { id: 0, name: "Sample task 1", description: "Sample description 1" }
// ];

let workday_tasks = await getWorkdayTasks();
let dayoff_tasks = await getDayoffTasks();

async function addWorkdayTask(new_name) {
    if (new_name == "") {
        return "fail";
    } else {
        db.query(`
            INSERT INTO workday(name, description)
            VALUES($1, $2)
        `, [new_name, ""]);
        workday_tasks = await getWorkdayTasks();
    }
    return "success";
}

async function addDayoffTask(new_name) {
    if (new_name == "") {
        return "fail";
    } else {
        db.query(`
            INSERT INTO dayoff(name, description)
            VALUES($1, $2)
        `, [new_name, ""]);
        dayoff_tasks = await getDayoffTasks();
    }
    return "success";
}

async function modifyWordayTask(id, new_name, new_descr) {
    if (id == "") {
        return "notfound";
    }
    if (new_name == "") {
        return "fail";
    }

    db.query(`
        UPDATE workday
        SET name = $1, description = $2
        WHERE id = $3
    `, [new_name, new_descr, id]);
    workday_tasks = await getWorkdayTasks();

    return "success";
}

async function modifyDayoffTask(id, new_name, new_descr) {
    if (id == "") {
        return "notfound";
    }
    if (new_name == "") {
        return "fail";
    }

    db.query(`
        UPDATE dayoff
        SET name = $1, description = $2
        WHERE id = $3
    `, [new_name, new_descr, id]);
    dayoff_tasks = await getDayoffTasks();

    return "success";
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/*
Render workday page
*/
app.get("/", (req, res) => {
    res.render("workday.ejs", {
        workday_tasks: workday_tasks,
        dayoff_tasks: dayoff_tasks,
        modify: modify,
        add: add
    });
    modify = "";
    add = "";
});

app.post("/task-added", async (req, res) => {
    modify = "";
    add = await addWorkdayTask(req.body["task-name"]);
    res.redirect("/");
});

app.post("/modify", async (req, res) => {
    add = "";
    modify = await modifyWordayTask(req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.redirect("/");
});

app.post("/deleted", async (req, res) => {
    if (req.body["current-id"] != "") {
        db.query(`
            DELETE FROM workday
            WHERE id = $1
        `, [req.body["current-id"]]);
        workday_tasks = await getWorkdayTasks();
    }

    res.redirect("/");
});


/*
Render dayoff page
*/
app.get("/dayoff", (req, res) => {
    res.render("dayoff.ejs", { workday_tasks: workday_tasks, dayoff_tasks: dayoff_tasks, modify: modify, add: add });
    modify = "";
    add = "";
})

app.post("/dayoff/task-added", async (req, res) => {
    modify = "";
    add = await addDayoffTask(req.body["task-name"]);
    res.redirect("/dayoff");
});

app.post("/dayoff/modify", async (req, res) => {
    add = "";
    modify = await modifyDayoffTask(req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.redirect("/dayoff");
});

app.post("/dayoff/deleted", async (req, res) => {
    if (req.body["current-id"] != "") {
        db.query(`
            DELETE FROM dayoff
            WHERE id = $1
        `, [req.body["current-id"]]);
        dayoff_tasks = await getDayoffTasks();
    }
    res.redirect("/dayoff");
});