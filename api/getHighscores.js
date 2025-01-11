const database = require('./index')

module.exports = async (req, res) => {
  try {
    const highscores = await database.collection('highscores')
      .find()
      .sort({ Score: -1 })
      .toArray()
    res.json(highscores)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}