const fetch = require("node-fetch")

exports.getUUID = async () => {
    const resonse = await fetch("https://www.uuidgenerator.net/api/version4")
    if (!resonse.ok) throw Error
    const uuid = await resonse.text()

    return uuid
}