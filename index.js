import express from "express";
import bodyParser from "body-parser";

let today_id = 3;
let work_id = 0;

let today_tasks_list = [ 
    {id: 0, name: "Task 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tristique cursus purus in mattis. Ut molestie varius mauris in eleifend."}, 
    {id: 1, name: "Task 2", description: "2 ipsum dolor sit amet, consectetur adipiscing elit."},
    {id: 2, name: "Task 3", description: "3 ipsum dolor sit amet, consectetur adipiscing elit."}
];

let work_tasks_list = [];

const app = express();
const port = 3000;

function modifyTask(list, id, new_name, new_descr) {
    if (id == "") return "notfound";
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

function deleteTask(list, id) {
    // if (id == "") return "notfound";
    // list =  list.slice(0, 1);
    // return "success";
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", (req, res) => {
    res.render("index.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: "" });
});

app.post("/task-added", (req, res) => {
    today_tasks_list.push({id: today_id, name: req.body["task-name"], description: ""});
    today_id++;
    res.render("index.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: "" });
});

app.post("/modify", (req, res) => {
    let result = modifyTask(today_tasks_list, req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.render("index.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: result });
});

app.post("/deleted", (req, res) => {
    // deleteTask(today_tasks_list, req.body["current-id"]);
    today_tasks_list = today_tasks_list.filter(e => {
        return e.id != req.body["current-id"];
    })
    res.render("index.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: "" });
});



app.get("/work", (req, res) => {
    res.render("work.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: "" });
})

app.post("/work/task-added", (req, res) => {
    work_tasks_list.push({id: work_id, name: req.body["task-name"], description: ""});
    work_id++;
    res.render("work.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: "" });
});

app.post("/work/modify", (req, res) => {
    let result = modifyTask(work_tasks_list, req.body["current-id"], req.body["new-name"], req.body["description"]);
    res.render("work.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: result });
});

app.post("/work/deleted", (req, res) => {
    work_tasks_list = work_tasks_list.filter(e => {
        return e.id != req.body["current-id"];
    })
    res.render("work.ejs", { today_tasks_list: today_tasks_list, work_tasks_list: work_tasks_list, result: "" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});