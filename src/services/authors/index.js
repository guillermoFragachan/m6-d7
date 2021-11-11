import express from 'express';


import  AuthorsModel from "./schema.js"

const authorsRouter = express.Router();

authorsRouter.post('/', async(req, res) => {

    const newAuthor = new AuthorsModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
})

authorsRouter.get('/', async(req, res) => {
    const authors = await AuthorsModel.find()
    res.send(authors)
})

authorsRouter.put('/:id', async(req, res) => {
    const { id } = req.params
    const author = await AuthorsModel.findByIdAndUpdate(id, req.body)
    res.send(author)
})

authorsRouter.delete('/:id', async(req, res) => {
    const { id } = req.params
    await AuthorsModel.findByIdAndDelete(id)
    res.send({ message: 'Author deleted' })
})






export default authorsRouter