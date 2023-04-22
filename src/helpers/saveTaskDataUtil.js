const saveTaskData = (data, reqType) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

module.exports = saveTaskData