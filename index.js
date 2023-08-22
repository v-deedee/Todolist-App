import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let add = "";
let modify = "";
let today_id = 3;
let work_id = 0;

let today_tasks_list = [ 
    {id: 0, name: "Sample task 1", description: "Sample description 1"}, 
    {id: 1, name: "Sample task 2", description: "Sample description 1"},
    {id: 2, name: "Sample task 3", description: "Sample description 1"}
];

let work_tasks_list = [];

function addTask(list, new_name, counter) {
    if (new_name == "") {
        return "fail";
    } else {
        list.push({id: counter, name: new_name, description: ""});
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
app.use(bodyParser.urlencoded({extended : true}));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

/*
Render today page
*/
app.get("/", (req, res) => {
    res.render("index.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, modify: modify, add: add });
    modify = "";
    add = "";
});

app.post("/task-added", (req, res) => {
    modify = "";
    add = addTask(today_tasks_list, req.body["task-name"], today_id);
    today_id++;
    res.redirect("/");
});

app.post("/modify", (req, res) => {
    add = "";
    modify = modifyTask(today_tasks_list, req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.redirect("/");
});

app.post("/deleted", (req, res) => {
    if (req.body["current-id"] != "") {
        today_tasks_list = today_tasks_list.filter(e => {
            return e.id != req.body["current-id"];
        });
    }
    res.redirect("/");
});


/*
Render work page
*/
app.get("/work", (req, res) => {
    res.render("work.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, modify: modify, add: add });
    modify = "";
    add = "";
})

app.post("/work/task-added", (req, res) => {
    modify = "";
    add = addTask(work_tasks_list, req.body["task-name"], work_id);
    work_id++;
    res.redirect("/work");
});

app.post("/work/modify", (req, res) => {
    add = "";
    modify = modifyTask(work_tasks_list, req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.redirect("/work");
});

app.post("/work/deleted", (req, res) => {
    if (req.body["current-id"] != "") {
        work_tasks_list = work_tasks_list.filter(e => {
            return e.id != req.body["current-id"];
        });
    }
    res.redirect("/work");
});