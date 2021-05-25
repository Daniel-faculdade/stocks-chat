const os = require("os")

const getIpAddress = () => {
    return  Object.values(os.networkInterfaces())
                    .flat()
                    .filter(({ family, internal }) => family === "IPv4" && !internal)
                    .map(({ address }) => address) 
}

module.exports = { getIpAddress }