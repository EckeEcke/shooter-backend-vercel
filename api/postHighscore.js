const database = require('./index')

module.exports = async (req, res) => {
  if (req.body.Player == undefined || req.body.Score == undefined) {
    res.status(500).send("Incomplete highscore data")
    return
  }

  try {
    const result = await database.collection('highscores').insertOne({
      Player: req.body.Player,
      Score: req.body.Score
    })
    res.json({ message: "Received request", result })
  } catch (err) {
    console.error(err)
    res.status(500).send("Error inserting data")
  }
}