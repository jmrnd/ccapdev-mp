import { Router } from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { UserSession } from '../models/UserSession.js';

const db = getDb();
const posts = db.collection('posts');

const router = Router();

router.get("/create-post", async (req, res) =>{

    const session = await UserSession.findOne({});
    const post = await 

m
});