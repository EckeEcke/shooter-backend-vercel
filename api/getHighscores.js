const { getHighscores } = require('./index')

module.exports = async (req, res) => {
  await getHighscores(req, res)
}