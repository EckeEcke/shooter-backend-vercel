const { handleCors, getHighscores } = require('./path-to-your-function-file')

module.exports = async (req, res) => {
  handleCors(req, res, () => getHighscores(req, res))
}
