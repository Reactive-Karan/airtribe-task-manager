const taskRoutes = require("express").Router()
const taskJsonData = require("../tasks.json")
const validator = require("../helpers/validator")
const bodyParser = require("body-parser")
const path = require("path")
const fs = require("fs")
const e = require("express")

taskRoutes.use(bodyParser.urlencoded({ extended: false }))
taskRoutes.use(bodyParser.json())



//Get task by id and update
taskRoutes.put("/:taskId", ((req, res) => {
    //taking task id out of params
    let taskId = req.params?.taskId
    let tasks = taskJsonData?.tasks
    let updateReqBody = req?.body
    //Checking if particular task exist on array or not
    let taskExists = tasks?.filter(item => item?.taskId === parseInt(taskId))
    //<==========We can move it to util file but for now let it be here!!=========>
    const validateReqBody = () => {
        if (updateReqBody.hasOwnProperty("taskText") ||
            updateReqBody.hasOwnProperty("taskId") ||
            updateReqBody.hasOwnProperty("priority") ||
            updateReqBody.hasOwnProperty("priorityId") ||
            updateReqBody.hasOwnProperty("creationDate")) {
            return { "status": true, "message": "" }
        } else {
            return { "status": false, "message": "Please provide correct keys to update data." }
        }
    }

    taskExists[0] = { ...taskExists[0], ...updateReqBody }

    //checking if result exists or not
    if (!taskExists.length || !validateReqBody().status) {
        res.status(404)
        if (!validateReqBody().status) {
            res.send(validateReqBody().message)
        }
        res.send("Task not found! Please try with valid task id.")
    }
    else {
        let result = {}
        //Finding the task id and returning the array without that particular task id
        if (taskId) {
            result = { tasks: tasks?.filter(item => item?.taskId !== parseInt(taskId)) }
            result.tasks.push(taskExists[0])
        }
        let writePath = path.join(__dirname, "..", "tasks.json")
        // Parsing to stringyfy in order to save it to file.
        let taskDataModified = JSON.parse(JSON.stringify(result))
        fs.writeFileSync(writePath, JSON.stringify(taskDataModified), { encoding: "utf-8", flag: "w" })
        res.status(200)
        res.send(`Successfully updated the task ${taskId}`)
    }
}))

//Get task by id and delete
taskRoutes.delete("/:taskId", ((req, res) => {
    //taking task id out of params
    let taskId = req.params?.taskId
    let tasks = taskJsonData?.tasks
    //Checking if particular task exist on array or not
    let taskExists = tasks?.filter(item => item?.taskId === parseInt(taskId))

    //checking if result exists or not
    if (!taskExists.length) {
        res.status(404)
        res.send("Task not found!")
    } else {
        let result = {}
        //Finding the task id and returning the array without that particular task id
        if (taskId) result = { tasks: tasks?.filter(item => item?.taskId !== parseInt(taskId)) }
        let writePath = path.join(__dirname, "..", "tasks.json")
        // Parsing to stringyfy in order to save it to file.
        let taskDataModified = JSON.parse(JSON.stringify(result))
        fs.writeFileSync(writePath, JSON.stringify(taskDataModified), { encoding: "utf-8", flag: "w" })
        res.status(200)
        res.send(`Successfully deleted the task ${taskId}`)
    }
}))


//Get request to fetch tasks by priority id
taskRoutes.get("/priority/:level", ((req, res) => {
    //taking task id out of params
    let priorityId = req.params?.level
    let tasks = taskJsonData.tasks
    console.log(req.params)
    //parsing task id because params return string and to strict check we need to convert it to int
    let result = tasks.filter(item => item.priorityId === parseInt(priorityId))

    //checking if result exists or not
    if (!result.length) {
        res.status(404)
        res.send(`Task not found with priority level ${priorityId}`)
    } else {
        res.status(200)
        res.send(result)
    }
}))

//Get request to fetch tasks by id
taskRoutes.get("/:taskId", ((req, res) => {
    //taking task id out of params
    let taskId = req.params?.taskId
    let tasks = taskJsonData.tasks
    //parsing task id because params return string and to strict check we need to convert it to int
    let result = tasks.filter(item => item.taskId === parseInt(taskId))

    //checking if result exists or not
    if (result.length) {
        res.status(404)
        res.send("Task not found!")
    } else {
        res.status(200)
        res.send(result)
    }
}))

// To create new tasks
taskRoutes.post("/", (req, res) => {
    const taskData = req.body
    //Adding date
    let writePath = path.join(__dirname, "..", "tasks.json")
    // Parsing json to an object
    let taskDataModified = JSON.parse(JSON.stringify(taskJsonData))
    // Sorting data by task Id
    let uniqueTaskId = taskDataModified.tasks.sort((a, b) => a.taskId - b.taskId)
    let modifiedReqData = {}
    // checking and assigning unique task id everytime so if it doesnt exists it will use 1
    if (uniqueTaskId?.length) modifiedReqData = { ...taskData, taskId: uniqueTaskId[uniqueTaskId.length - 1].taskId + 1, creationDate: new Date().toISOString() }
    else modifiedReqData = { ...taskData, taskId: 1, creationDate: new Date().toISOString() }

    if (validator.validateTaskInfo(modifiedReqData, taskJsonData).status) {
        // pushing new request data into the array of tasks
        taskDataModified.tasks.push(modifiedReqData)
        fs.writeFileSync(writePath, JSON.stringify(taskDataModified), { encoding: "utf-8", flag: "w" })
        res.status(200)
        res.json(validator.validateTaskInfo(modifiedReqData, taskJsonData))

    } else {
        res.status(400)
        res.json(validator.validateTaskInfo(modifiedReqData, taskJsonData))
    }
})

//Just an get request to fetch all the tasks
taskRoutes.get("/", ((req, res) => {
    res.status(200)
    res.send(taskJsonData)
}))


module.exports = taskRoutes