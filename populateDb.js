// System-related packages
import "dotenv/config";
import { User } from "./src/models/User.js"
import { UserSession } from "./src/models/UserSession.js";
import { Post } from "./src/models/Post.js";
import { Comment } from "./src/models/Comment.js";
import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI).then(() => {
    console.log("Populating DB...");
});

async function main() {
    // Creating 5 Sample Users in Users Collection
    await User.create({   username: "joolzie123",
                    displayName: "Joolz Ryane",
                    password: "12345678",
                    email: "joolzie123@gmail.com",
                    description: "hello world! :>",
                    icon: "/static/images/profile_pictures/joolzie123.jpeg" });

    await User.create({   username: "coc_man_2099",
                    displayName: "Jamar",
                    password: "$%hello%$",
                    email: "coc_man@gmail.com",
                    description: "Probably binge watching a TV show",
                    icon: "/static/images/profile_pictures/coc_man_2099.jpeg" });

    await User.create({   username: "coco_san00",
                    displayName: "Coco",
                    password: "pa$$worD",
                    email: "coco_san@gmail.com",
                    description: "New fitness enthusiast",
                    icon: "/static/images/profile_pictures/coco_san00.jpeg"});

    await User.create({   username: "gundamn",
                    displayName: "Rui",
                    password: "@bcdeFG%",
                    email: "gundamn@gmail.com",
                    description: "Scrolling on foroom at 3am",
                    icon: "/static/images/profile_pictures/gundamn.jpeg" });

    await User.create({   username: "cirup29",
                    displayName: "Rafael",
                    password: "for00m%%",
                    email: "cirup@gmail.com",
                    description: "yooo",
                    icon: "/static/images/profile_pictures/cirup29.jpeg" });
    console.log("-- Users created");

    const joolzie123 = await User.findOne({ username: "joolzie123"});
    const coc_man_2099 = await User.findOne({ username: "coc_man_2099"});
    const coco_san00 = await User.findOne({ username: "coco_san00"});
    const gundamn = await User.findOne({ username: "gundamn"});
    const cirup29 = await User.findOne({ username: "cirup29"});

    // Creating 5 Sample Posts in Posts Collection
    const post1 = await Post.create({    title: "Check out this awesome HTML5 trick!!!!",
                        body: "Hey folks, just stumbled upon this cool HTML5 trick and wanted to share it with you all. Did you know that you can use the 'video' tag to embed videos directly into your web page? It's super easy and adds a nice touch to your site. Give it a try!",
                        postDate: "2023-06-14T16:00:00.000Z",
                        author: joolzie123._id,
                        totalVotes: "15",
                        totalComments: "3"
                    });

    const post2 = await Post.create({    title: "Favorite Binge-Worthy TV Shows",
                        body: "Calling all TV addicts! Let's talk about our favorite binge-worthy TV shows. Which series have kept you glued to the screen, eagerly clicking that \"Next Episode\" button? Whether it's gripping dramas, hilarious comedies, or thrilling sci-fi, share your top picks and let's indulge in some television talk!",
                        postDate: "2023-04-14T16:00:00.000Z",
                        author: coc_man_2099._id,
                        totalVotes: "10",
                        totalComments: "3"
                    });

    const post3 = await Post.create({    title: "Fitness Tips for Beginners",
                        body: "Attention fitness enthusiasts! Let's help out the beginners on their fitness journey. If you have any valuable tips, advice, or resources for someone who's just starting to embrace a healthier lifestyle, share them here. From workout routines to healthy eating habits or even mental wellbeing, let's empower each other to lead healthier lives!",
                        postDate: "2020-04-30T16:00:00.000Z",
                        author: coco_san00._id,
                        totalVotes: "2",
                        totalComments: "3"
                    });

    const post4 = await Post.create({    title: "Share Your Funniest \"Auto-correct Fails\"",
                        body: "Auto-correct can be both a lifesaver and a source of hilarious confusion. Share your funniest auto-correct fails or embarrassing texting mishaps that left you in stitches. Let's commiserate and laugh together over the perils of technology!",
                        postDate: "2023-06-19T16:00:00.000Z",
                        author: cirup29._id,
                        totalVotes: "6",
                        totalComments: "3"
                    });

    const post5 = await Post.create({    title: "Share Your Funniest Programming Jokes",
                        body: "Calling all coders with a sense of humor! Let's lighten up the coding world with some good-natured jokes. Share your funniest programming jokes or hilarious coding anecdotes. It's time to bring a smile to our fellow developers' faces!",
                        postDate: "2021-01-31T16:00:00.000Z",
                        author: joolzie123._id,
                        totalVotes: "7",
                        totalComments: "3"
                });

    const post6 = await Post.create({    title: "Laufey in Manila",
                        body: "Just got back from the Laufey concert in Manila and WOW! It was a mind blowing experience. I’ve been a fan for a while now and it was surreal to see her perform live. Laufey's voice is even more enchanting in person. The atmosphere was electric and everyone was singing along- Not to mention the set list was *chef’s kiss* Who else attended? Share your experiences!",
                        postDate: "2023-05-29T16:00:00.000Z",
                        author: joolzie123._id,
                        totalVotes: "23",
                        totalComments: "3"
                    });
    console.log("-- Posts created");
    
    // Creating Sample Comments in Comments Collection
    const comment1 = await Comment.create({
                        author: cirup29._id,
                        commentDate: "06/16/2023",
                        totalVotes: 3,
                        isDeleted: false,
                        body: "Whoa, that's neat! I'll definitely try it out on my next project. Thanks for sharing, joolzie123!",
                        post: post1._id,
    });

    const comment2 = await Comment.create({
            author: coco_san00._id,
            commentDate: "06/17/2023",
            totalVotes: 5,
            isDeleted: false,
            body: "That's a great tip! Videos can really enhance the author experience. I've used it before, and it worked like a charm.",
            post: post1._id

    });

    const comment3 = await Comment.create({
        author: coc_man_2099._id,
        commentDate: "06/18/2023",
        totalVotes: 3,
        isDeleted: false,
        body: "Nice find, can you also share any resources or tutorials to help us implement it effectively?",
        post: post1._id

    });

    const comment4 = await Comment.create({
        author: cirup29._id,
        commentDate: "04/15/2023",
        totalVotes: 15,
        isDeleted: false,
        body: "Brooklyn Nine-Nine is my go-to comedy series. The hilarious cast and witty writing never fail to put a smile on my face.",
        post: post2._id

    });

    const comment5 = await Comment.create({
        author: coco_san00._id,
        commentDate: "04/16/2023",
        totalVotes: 6,
        isDeleted: false,
        body: "If you haven't watched Breaking Bad yet, you're missing out! The intense storyline and brilliant performances make it an absolute must-watch.",
        post: post2._id

    });

    const comment6 = await Comment.create({
        author: gundamn._id,
        commentDate: "04/21/2023",
        totalVotes: 8,
        isDeleted: false,
        body: "Stranger Things is a fantastic sci-fi show that captures the '80s nostalgia perfectly. The suspenseful plot and lovable characters make it a binge-worthy delight.",
        post: post2._id

    });

    const comment7 = await Comment.create({
        author: joolzie123._id,
        commentDate: "05/01/2020",
        totalVotes: 4,
        isDeleted: false,
        body: "Consistency is key! Start with small achievable goals and gradually increase the intensity. Remember, progress is progress, no matter how small.",
        post: post3._id

    });

    const comment8 = await Comment.create({
        author: coc_man_2099._id, //reply to joolzie
        commentDate: "05/01/2020",
        totalVotes: 8,
        isDeleted: false,
        body: "Don't forget to prioritize mental wellbeing alongside physical fitness. Incorporating mindfulness practices like yoga or meditation can bring balance and reduce stress.",
        post: post3._id
    });

    const comment9 = await Comment.create({
        author: cirup29._id,
        commentDate: "05/01/2020",
        totalVotes: 1,
        isDeleted: false,
        body: "Don't underestimate the power of nutrition. Focus on incorporating whole, unprocessed foods into your diet and hydrate well. It's a game-changer for your overall health and fitness.",
        post: post3._id

    });

    const comment10 = await Comment.create({
        author: gundamn._id, 
        commentDate: "06/20/2023",
        totalVotes: 3,
        isDeleted: false,
        body: "I once texted my friend, \"I'm heading to the bar for drinks.\" Auto-correct changed it to \"I'm heading to the bat for drinks.\" Needless to say, it raised some eyebrows!",
        post: post4._id

    });

    const comment11 = await Comment.create({
        author: coco_san00._id,
        commentDate: "06/25/2023",
        totalVotes: 6,
        isDeleted: false,
        body: "I once sent my mom a text saying, \"Dinner will be owl-ready.\" Auto-correct turned \"owl-ready\" into \"bowling.\" She thought we were having a bowling party at home!",
        post: post4._id

    });

    const comment12 = await Comment.create({
        author: joolzie123._id,
        commentDate: "06/27/2023",
        totalVotes: 9,
        isDeleted: false,
        body: "My friend texted me, \"I'll bring the wime.\" Auto-correct transformed \"wime\" into \"mime.\" We ended up having a good laugh about picturing a silent mime at the party!",
        post: post4._id

    });

    const comment13 = await Comment.create({
        author: coco_san00._id,
        commentDate: "02/01/2021",
        totalVotes: 15,
        isDeleted: false,
        body: "Why do programmers prefer dark mode? Because light attracts bugs!",
        post: post5._id

    });

    const comment14 = await Comment.create({
        author: cirup29._id,
        commentDate: "02/01/2021",
        totalVotes: 6,
        isDeleted: false,
        body: "Why did the CSS developer go broke? Because he lost his style!",
        post: post5._id

    });

    const comment15 = await Comment.create({
        author: gundamn._id,
        commentDate: "02/01/2021",
        totalVotes: 3,
        isDeleted: false,
        body: "Why did the programmer quit his job? Because he didn't get arrays!",
        post: post5._id

    });

    const comment16 = await Comment.create({
        author: coco_san00._id,
        commentDate: "05/30/2023",
        totalVotes: 7,
        isDeleted: false,
        body: "Oh, I wish I could've been there! How was the concert? I've been a fan of Laufey for a while now, and I can only imagine how amazing it must have been to see them perform live.",
        post: post6._id

    });

    const comment17 = await Comment.create({
        author: cirup29._id,
        commentDate: "05/30/2023",
        totalVotes: 5,
        isDeleted: false,
        body: "I'm so jealous! I've been obsessed with Laufey's debut EP, and I can only imagine how mesmerizing the live performance was",
        post: post6._id

    });
    console.log("-- Comments created");

    await Post.findOneAndUpdate({_id: post1._id},{ comments: [comment1._id,comment2._id,comment3._id]},{ new: true });
    await Post.findOneAndUpdate({_id: post2._id},{ comments: [comment4._id,comment5._id,comment6._id]},{ new: true });
    await Post.findOneAndUpdate({_id: post3._id},{ comments: [comment7._id,comment8._id,comment9._id]},{ new: true });
    await Post.findOneAndUpdate({_id: post4._id},{ comments: [comment10._id,comment11._id,comment12._id]},{ new: true });
    await Post.findOneAndUpdate({_id: post5._id},{ comments: [comment13._id,comment14._id,comment15._id]},{ new: true });
    await Post.findOneAndUpdate({_id: post6._id},{ comments: [comment16._id,comment17._id]},{ new: true });

    //Creating a User Session
    await UserSession.create({userID: joolzie123._id});
    console.log("-- UserSession created");

    console.log("Completed!");
}

main();