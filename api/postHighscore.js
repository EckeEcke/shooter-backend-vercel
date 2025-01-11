const { handleCors, postHighscore } = require('./path-to-your-function-file')

module.exports = async (req, res) => {
  handleCors(req, res, () => postHighscore(req, res))
}
