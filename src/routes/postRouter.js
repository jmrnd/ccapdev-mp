import { Router } from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { UserSession } from '../models/UserSession.js';
import bodyParser from 'body-parser';

const postRouter = Router();

postRouter.use(bodyParser.urlencoded({ extended: true}));
postRouter.use(bodyParser.json());

postRouter.get("/create-post", async (req, res) => {
    try {
        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });
    
        if (currentUser) {
            res.render("create-post", {
                username: currentUser.username,
                icon: currentUser.icon
            });
        } else {
            // No user found
            console.log("No user found");
            // To redirect to an error page
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error occurred while retrieving user:", error);
        res.status(500).send("Internal Server Error"); // To redirect to an error page
    }
});


postRouter.post('/create_post', async (req, res) => {
    try {
        const session = await UserSession.findOne({});
        const currentUser = await User.findOne({ _id: session.userID });
      // Extract data from the form
      const { title, text } = req.body;
        console.log(req.body);
      // Create a new Post instance
      const newPost = new Post({
        title,
        body: text,
        author: currentUser,
        postDate: new Date(),
        totalVotes: 0,
        totalComments: 0,
        comments: [],
      });
  
      // Save the new post to the database
      await newPost.save();
  
      // Redirect to a success page or perform any other actions
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error saving post to the database.');
    }
  });

  export default postRouter;