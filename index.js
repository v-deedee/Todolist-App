import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let add = "";
let modify = "";
let workday_id = 3;
let dayoff_id = 0;

// let workday_tasks_list = [
//     { id: 0, name: "Sample task 1", description: "Sample description 1" },
//     { id: 1, name: "Sample task 2", description: "Sample description 1" },
//     { id: 2, name: "Sample task 3", description: "Sample description 1" }
// ];
let workday_tasks_list = [];


let dayoff_tasks_list = [];

function addTask(list, new_name, counter) {
    if (new_name == "") {
        return "fail";
    } else {
        list.push({ id: counter, name: new_name, description: "" });
    }
    return "success";
}

function modifyTask(list, id, new_name, new_descr) {
    if (id == "") {
        return "notfound";
    }
    if (new_name == "") {
        return "fail";
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i]["id"] == id) {
            list[i]["name"] = new_name;
            list[i]["description"] = new_descr;
            break;
        };
    };
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
        workday_tasks_list: workday_tasks_list,
        dayoff_tasks_list: dayoff_tasks_list,
        modify: modify,
        add: add
    });
    modify = "";
    add = "";
});

app.post("/task-added", (req, res) => {
    modify = "";
    add = addTask(workday_tasks_list, req.body["task-name"], workday_id);
    workday_id++;
    res.redirect("/");
});

app.post("/modify", (req, res) => {
    add = "";
    modify = modifyTask(workday_tasks_list, req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.redirect("/");
});

app.post("/deleted", (req, res) => {
    if (req.body["current-id"] != "") {
        workday_tasks_list = workday_tasks_list.filter(e => {
            return e.id != req.body["current-id"];
        });
    }
    res.redirect("/");
});


/*
Render dayoff page
*/
app.get("/dayoff", (req, res) => {
    res.render("dayoff.ejs", { workday_tasks_list: workday_tasks_list, dayoff_tasks_list: dayoff_tasks_list, modify: modify, add: add });
    modify = "";
    add = "";
})

app.post("/dayoff/task-added", (req, res) => {
    modify = "";
    add = addTask(dayoff_tasks_list, req.body["task-name"], dayoff_id);
    dayoff_id++;
    res.redirect("/dayoff");
});

app.post("/dayoff/modify", (req, res) => {
    add = "";
    modify = modifyTask(dayoff_tasks_list, req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.redirect("/dayoff");
});

app.post("/dayoff/deleted", (req, res) => {
    if (req.body["current-id"] != "") {
        dayoff_tasks_list = dayoff_tasks_list.filter(e => {
            return e.id != req.body["current-id"];
        });
    }
    res.redirect("/dayoff");
});