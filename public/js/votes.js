
let upvoteBtn = document.querySelectorAll('.postUpvote');
let downvoteBtn = document.querySelectorAll('.postDownvote');

upvoteBtn.forEach(button => {
    button.addEventListener("click", event => {
        console.log("I am here");
        const clickedButtonId = event.target.id; // upvoteIcon/{{this._id}}
        const data = {
          _id: clickedButtonId.substring(10) // {{this._id}}
        }

        const path = "/" + clickedButtonId; // construct path

        try{
          const res = fetch(path, { // /upvoteIcon/{{this._id}}
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // parse ID
          })
            location.reload();
        }
        //  FETCHING FROM SERVER
        // .then(response => response.json())
        // .then(data => {
        //   // Handle the response from the server
        //   document.getElementById('voteCount').innerText = data.voteCount;
        // })
        catch(error){
          console.error('Error:', error);
        };
      });
    });

  downvoteBtn.forEach(button => {
    button.addEventListener("click", event => {
      console.log("I am here");
      const clickedButtonId = event.target.id; // upvoteIcon/{{this._id}}
      const data = {
        _id: clickedButtonId.substring(10) // {{this._id}}
      }

      const path = "/" + clickedButtonId; // construct path

      try{
        const res = fetch(path, { // /upvoteIcon/{{this._id}}
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), // parse ID
        })
          location.reload();
      }
      //  FETCHING FROM SERVER
      // .then(response => response.json())
      // .then(data => {
      //   // Handle the response from the server
      //   document.getElementById('voteCount').innerText = data.voteCount;
      // })
      catch(error){
        console.error('Error:', error);
      };
    });
  });

let commentUpvoteBtn = document.querySelectorAll('.commentUpvote');
let commentDownvoteBtn = document.querySelectorAll('.commentDownvote');

commentUpvoteBtn.forEach(button => {
    button.addEventListener("click", event => {
        console.log("I am here");
        const clickedButtonId = event.target.id; // upvoteIcon/{{this._id}}
        const data = {
          _id: clickedButtonId.substring(17) // {{this._id}}
        }

        const path = "/" + clickedButtonId; // construct path

        console.log(path);
        try{
          const res = fetch(path, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // parse ID
          })
            location.reload();
        }
        catch(error){
          console.error('Error:', error);
        };
      });
    });


  commentDownvoteBtn.forEach(button => {
    button.addEventListener("click", event => {
      console.log("I am here");
      const clickedButtonId = event.target.id; // upvoteIcon/{{this._id}}
      const data = {
        _id: clickedButtonId.substring(18) // {{this._id}}
      }

      const path = "/" + clickedButtonId; // construct path

      try{
        const res = fetch(path, { // /upvoteIcon/{{this._id}}
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), // parse ID
        })
          location.reload();
      }
      catch(error){
        console.error('Error:', error);
      };
    });
  });
