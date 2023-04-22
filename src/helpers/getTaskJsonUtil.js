const getTaskData = (dataPath) => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}

module.exports = getTaskData 