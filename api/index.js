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

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  return await fn(req, res)
}

const getHighscores = async (req, res) => {
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
  if (req.method === 'POST') {
    try {
      await connectToDatabase()
      const newHighscore = req.body
      await database.collection('highscores').insertOne(newHighscore)
      res.status(201).json({ message: 'Highscore added successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to add highscore' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

module.exports = {
  getHighscores: allowCors(getHighscores),
  postHighscore: allowCors(postHighscore)
}
