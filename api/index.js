const { MongoClient } = require("mongodb")
const cors = require('cors')
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

const corsMiddleware = cors({ origin: '*' })

const getHighscores = async (req, res) => {
  corsMiddleware(req, res, async () => {
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
  })
}

const postHighscore = async (req, res) => {
  corsMiddleware(req, res, async () => {
    if (req.method === 'POST') {
      try {
        await connectToDatabase()
        const newHighscore = req.body
        await database.collection('highscores').insertOne(newHighscore)
        res.status(201).json({ message: 'Highscore added successfully' })
      } catch (error) {
        res.status(500).json({ error: 'Failed to add highscore' })
      }
    } else if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.status(204).end()
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  })
}

module.exports = { getHighscores, postHighscore }