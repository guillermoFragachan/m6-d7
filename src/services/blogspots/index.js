import express from "express";
import q2m from "query-to-mongo"

import blogpostSchema from "./shema.js";
import authorsModel from "../authors/schema.js";
import userModel from "../users/schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";


const router = express.Router();


router.post("/", async (req, res, next) => {


      // const author = await authorsModel.findById(req.body.author)
      // console.log(author)


      const newBlog = new blogpostSchema(req.body,
      ) 


      const { _id, authors } = await newBlog.save() 
      res.status(201).send({ _id, authors })

       //proide authoer with ID findALL by id 

    
  })

//route that creates a new blogpost with user authetication
router.post("/me",basicAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user
      req.body.authors = user._id
      console.log(user)
      const newBlog = new blogpostSchema(req.body) 
     
    const { _id, authors } = await newBlog.save() 
    res.status(201).send({ _id, authors })
  } catch (error) {
    next(error)
  }  


})

router.get("/", async(req, res) => {
    // const blogs = await blogpostSchema.find()

    const mongoQuery = q2m(req.query)
    console.log(mongoQuery, "dsadasd")
    const total = await blogpostSchema.countDocuments(mongoQuery.criteria)
    const blogs = await blogpostSchema.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .populate({path:"authors"})


    res.send({ links: mongoQuery.links("/blogspot", total), pageTotal: Math.ceil(total / mongoQuery.options.limit), total, blogs })
})

//ENPOINT STORIES
router.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user
    const blogs = await blogpostSchema.find({ authors: user._id })
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})
//ENDPOINT WITH USER AUTHENTICATION

router.put("/me/:id", basicAuthMiddleware, async(req, res) => {

  const userBlogs = await blogpostSchema.findOneAndUpdate({ authors: req.user._id }, req.body, { new: true })

  
    res.send(userBlogs)
  
  
})

router.delete("/me/:id", basicAuthMiddleware,  async(req, res) => {
  const blog = await blogpostSchema.findOneAndDelete({ authors: req.user._id }, req.body)
  res.send(blog)
})
//ENDPOINT WITHOUT USER AUTHENTICATION

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