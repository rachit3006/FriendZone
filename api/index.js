import Express from "express";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import authRoutes  from "./routes/auth.js"

const app = Express();

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/comments",commentRoutes)
app.use("/api/likes",likeRoutes)
app.use("/api/auth",authRoutes)


app.listen(8800, () => {
    console.log("YAY !")
})