const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const taskRoutes = require("./routes/taskRoutes")
const app = express()
const routes = require("express").Router()

app.use(cors())
app.use(routes)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const PORT = 8080


routes.use("/tasks", taskRoutes)

routes.get("/", (req, res) => {
    res.status(200)
    res.send("Welcome to airtribe task manager")
})




app.listen(PORT, (error) => {
    if (error) {
        console.log("[Internal]:Error occurred, server", PORT, "can't start", error);
    }
    else {
        console.log("Server is Successfully Running and App is listening on port " + PORT);
    }
})