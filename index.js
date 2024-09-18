const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config()
app.use(cors());
app.use(express.json());


app.post('/upload', async (req, res) => {
    try {
        const { _id, title, imageUrl, price } = req.body;

        // Get the database collection instance
        const collectionNfts = await getDbInstance('NFTs');

        // Insert the NFT data (as an object) into the collection
        const insertResult = await collectionNfts.insertOne({
            _id: _id,
            title: title,
            imageUrl: imageUrl,
            price: price
        });

        // Log and return the result
        console.log('Inserted document =>', insertResult);
        res.json(insertResult);
    } catch (error) {
        console.error('Error inserting NFT:', error);
        res.status(500).json({ message: 'Error uploading NFT' });
    }
});

app.get('/nft', async (req, res) => {
    const collectionNfts = await getDbInstance('NFTs');
    const nfts = await collectionNfts.find({}).toArray();
    res.json(nfts);
});






async function getDbInstance(collectionName) {
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);

    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('NFT_Marketplace');
    const collection = db.collection(collectionName);

    return collection;
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('Server is running on port 3001');

});