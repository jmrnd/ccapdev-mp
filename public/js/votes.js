
let upvoteBtn = document.querySelectorAll('.iconGrid-upvote');
let downvoteBtn = document.querySelectorAll('.iconGrid-downvote');
let voteCount = document.querySelectorAll('.iconGrid-text');

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
