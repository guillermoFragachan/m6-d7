import express from "express";

import blogpostSchema from "./shema.js";


const router = express.Router();


router.post("/", async (req, res, next) => {
    
      const newBlog = new blogpostSchema(req.body) 
      const { _id } = await newBlog.save() 
      res.status(201).send({ _id })
    
  })

router.get("/", async(req, res) => {
    const blogs = await blogpostSchema.find()
    res.send(blogs)
});


router.get("/:id", async(req, res) => {
    const blog = await blogpostSchema.findById(req.params.id)
    res.send(blog)
});


router.put("/:id", async(req, res) => {
    const blog = await blogpostSchema.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(blog)
});

router.delete("/:id", async(req, res) => {
    const blog = await blogpostSchema.findByIdAndDelete(req.params.id)
    res.send(blog)
});



export default router