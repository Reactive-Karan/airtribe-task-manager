class validator {
    static validateTaskInfo(taskInfo, taskData) {
        if (
            taskInfo.hasOwnProperty("taskText") &&
            taskInfo.hasOwnProperty("taskId") &&
            taskInfo.hasOwnProperty("priority") &&
            taskInfo.hasOwnProperty("priorityId") &&
            taskInfo.hasOwnProperty("creationDate")
        ) {
            if (!this.validateUniqueTaskId(taskInfo, taskData)) {
                return {
                    "status": false,
                    "message": "Task id has to be unique."
                }
            }
            return {
                "status": true,
                "message": "Task has been Added."
            }
        } else {
            return {
                "status": false,
                "message": "Task infor is malformed please provide all the properties."
            }
        }

    }
    static validateUniqueTaskId(courseInfo, taskData) {
        let valueFound = taskData.tasks.some(element => element.taskId === courseInfo.taskId)
        if (valueFound) return false;
        return true
    }
}

module.exports = validator