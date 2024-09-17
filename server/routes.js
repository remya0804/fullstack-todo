const express = require('express');

const router = express.Router();

const {getConnectedClient} = require('./database');

const {ObjectId} = require('mongodb')


const getCollections = () => {

    const client = getConnectedClient();

    const collections = client.db("tododb").collection("todos");

    return collections;
}

router.get('/todos', async (req,res) => {

    const collection = getCollections();

    const todos = await collection.find({}).toArray();

    res.status(200).json(todos);

    // res.status(200).json({msg: "Get Request"});
});

router.post('/todos',async (req,res) => {

    const collecton = getCollections();

    let {todo} = req.body;

    if(!todo){

        return res.status(400).json({msg: "No todo found"});
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

    const newTodo = await collecton.insertOne({todo,status:false})

    res.status(201).json({todo, status: false, _id: newTodo.insertedId});

    // res.status(201).json({msg: "Post Request"});
});

router.put('/todos/:id',async (req,res) => {

    const collecton = getCollections();

    const _id = new ObjectId(req.params.id);

    const {status} = req.body;

    if(typeof status !== "boolean"){

        return res.status(400).json({msg: "Invalid status"});
    }

    const updatedTodo = await collecton.updateOne({_id},{$set: {status: !status}})

    res.status(200).json(updatedTodo);

    // res.status(200).json({msg: "Put Request"});
});

router.delete('/todos/:id',async (req,res) => {

    const collecton = getCollections();

    const _id = new ObjectId(req.params.id);

    const deletedTodo = await collecton.deleteOne({_id});

    res.status(200).json(deletedTodo);

    // res.status(200).json({msg: "Delete Request"});
});

module.exports = router;