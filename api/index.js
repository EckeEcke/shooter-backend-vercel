const { MongoClient } = require("mongodb")
require('dotenv').config()

let database
const uri = `mongodb+srv://ceckardt254:${process.env.DATABASE_PASSWORD}@cluster0.sen83.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const connectToDatabase = async () => {
  if (!database) {
    try {
      await client.connect()
      database = client.db('js-shooter')
    } catch (error) {
      console.error(error)
    }
  }
}

const getHighscores = async (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method === 'GET') {
    try {
      await connectToDatabase()
      const highscores = await database.collection('highscores')
        .find()
        .sort({ Score: -1 })
        .toArray()
      res.status(200).json(highscores)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch highscores' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

const postHighscore = async (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader