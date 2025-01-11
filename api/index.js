const { MongoClient } = require("mongodb")
require('dotenv').config()

let database;
const uri = `mongodb+srv://ceckardt254:${process.env.DATABASE_PASSWORD}@cluster0.sen83.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const run = async () => {
  try {
    await client.connect()
    database = client.db('js-shooter')
  } catch (error) {
    console.error(error)
  }
}

run().catch(console.dir)

module.exports = database