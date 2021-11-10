import express from "express";
import q2m from "query-to-mongo"

import blogpostSchema from "./shema.js";



const router = express.Router();


router.post("/", async (req, res, next) => {
    
      const newBlog = new blogpostSchema(req.body) 
      const { _id } = await newBlog.save() 
      res.status(201).send({ _id })
    
  })

router.get("/", async(req, res) => {
    // const blogs = await blogpostSchema.find()

    const mongoQuery = q2m(req.query)
    console.log(mongoQuery)
    const total = await blogpostSchema.countDocuments(mongoQuery.criteria)
    const blogs = await blogpostSchema.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)



    res.send({ links: mongoQuery.links("/blogspot", total), pageTotal: Math.ceil(total / mongoQuery.options.limit), total, blogs })
})


router.get("/:id", async(req, res) => {
    const blog = await blogpostSchema.findById(req.params.id)
    res.send(blog)
})


router.put("/:id", async(req, res) => {
    const blog = await blogpostSchema.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.send(blog)
})

router.delete("/:id", async(req, res) => {
    const blog = await blogpostSchema.findByIdAndDelete(req.params.id)
    res.send(blog)
})




/// *************** COMMENTS ***************************


router.get("/:id/comments", async(req, res, next) => {

    const blog = await blogpostSchema.findById(req.params.id)
    res.send(blog.comments)

})

router.post("/:id/comments", async(req, res, next) => {
    const comment = req.body

      const updateBlogspot = await blogpostSchema.findByIdAndUpdate(
        req.params.id, 
        { $push: { comments: comment } }, 
        { new: true } 
        )

        res.send(updateBlogspot)
})


router.put("/:id/comments/:commentId", async(req, res, next) => {
        const comment = req.body

      const updateBlogspot = await blogpostSchema.findByIdAndUpdate(req.params.id)

        const index = updateBlogspot.comments.findIndex(p => p._id.toString() === req.params.commentId)

        
        updateBlogspot.comments[index] = {...updateBlogspot.comments[index].toObject(), ...comment}

        await updateBlogspot.save()

        res.send(updateBlogspot.comments[index])


})

router.delete("/:id/comments/:commentId", async(req, res, next) => {
        
        const updateBlogspot = await blogpostSchema.findByIdAndUpdate(
            req.params.id, 
            { $pull: { comments: { _id: req.params.commentId } } }, 
            { new: true } //what was it this for?

            )
    
            res.send(updateBlogspot)
})


router.get("/:id/comments/:commentId", async(req, res, next) => {
        
        const blog = await blogpostSchema.findById(req.params.id)
        const comment = blog.comments.id(req.params.commentId)
        res.send(comment)
})





export default router