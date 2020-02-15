class Icndb {

    url = 'http://api.icndb.com/jokes/random'

    exportText = (res) => {
        return res.value.joke
    }
}

module.exports = Icndb