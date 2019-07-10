/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var Thread = require("../models/Thread.js")

var expect = require('chai').expect;

module.exports = function (app) {

//Thread Routes  
  app.route('/api/threads/:board')
    // Create a new thread in board
    .post(function (req, res){
      // console.log("---- POST /api/threads/:board ----")
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----")
    
      //Setup new thread info for db
      var newThreadInfo = {
        text: req.body.text,
        delete_password: req.body.delete_password,
        board: req.body.board
        };
      // Create thread in db
      Thread.create(newThreadInfo, (err, newThread) =>{
        err ? console.log('Error when creating new thread. ', err) : null
        res.redirect('/b/' + req.params.board + '/' + newThread._id);
      })
      
    })
  
    // Retrieve recent 10 threads on board in desc order
    .get((req, res)=>{
      // console.log("---- GET /api/threads/:board ----")
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----")
    
      Thread
        .find({board: req.params.board})
        .sort({bumped_on: 'desc'})
        .limit(10)
        .exec((err, foundThreads)=>{
          err ? console.log("Error finding threads: ", err):null
          res.send(foundThreads)
        })
    })
    // Update thread as reported
    .put((req,res)=>{
      // console.log("---- PUT /api/threads/:board ----")
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----")
      
      Thread.findOneAndUpdate( {_id: req.body.report_id}, { reported: true }, ( err )=>{
        err ? console.log("Error finding thread for report: ", err) : null
        res.send('Thread ID: ' +req.body.report_id+ " has been reported.")
      } )
    })
    // Delete thread
    .delete((req,res)=>{
      // console.log("---- DELETE /api/threads/:board ----")
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----")
    
      var targetID = req.body.thread_id
      
      Thread.findOne( { _id: targetID }, (err, foundThread)=>{
        // console.log("---- foundThread in DELETE ----")
        // console.log(foundThread)
        // console.log('---- End ----')
        
        err ? console.log("Error finding thread to delete: ", err) : null
        foundThread.verifyDelete_password(req.body.delete_password)
          .then(function(valid) {
            if (valid) {
              Thread.deleteOne({ _id: targetID  }, (err)=>{ res.send('Thread ID: ' +targetID+ " has been deleted."); })
              
            } else {
              res.send('Thread ID: ' +targetID+ " has not been deleted, incorrect password.");
            }
          })
          .catch(function(err) {
            err ? console.log("Error deleting thread: ", err) : null
          });
      });
    });
  
// Reply Routes  
  app.route('/api/replies/:board')
    //Create new reply
    .post((req,res)=>{
      // console.log("---- POST /api/replies/:board ----")
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----")
    
      //Setup Reply for use in db
      var newReply = { text: req.body.text,
                       delete_password: req.body.delete_password }
      
      Thread.findOne( {_id: req.body.thread_id}, (err, foundThread)=>{
        // console.log('Reply for: ' + foundThread)
        err ? console.log("Error finding thread for reply creation: ", err) : null
        foundThread.replies.unshift(newReply);
        foundThread.bumped_on = new Date();
        foundThread.markModified('bumped_on');
        foundThread.save((err)=>{
          err ? console.log("Error saving thread for reply : ", err) : null
          res.redirect('/b/' + req.params.board + '/' + foundThread._id);
        });
        
      })
    })
    // Retrieve a single thread (with all replies)
    .get((req,res)=>{
      // console.log("---- GET /api/replies/:thread_id ----");
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----");
    
      Thread.findById(req.params.board, (err, foundThread)=>{
        res.send(foundThread)
      })
    })
    // Update reply as reported on a thread
    .put((req,res)=>{
      // console.log("---- PUT /api/replies/:thread_id ----");
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----");
    
    Thread.findById(req.body.thread_id, (err, foundThread)=>{
      var currReplyIndex = foundThread.replies.findIndex( (currReply)=>{ return currReply._id == req.body.reply_id } );
      // console.log(foundThread.replies[currReplyIndex].reported);
      foundThread.replies[currReplyIndex].reported = true;
      foundThread.save((err)=>{
          err ? console.log("Error saving reply while reporting : ", err) : null
          res.send('Reply ID: ' +req.body.reply_id+ " has been reported.");
        });
    })
    
    })
    // Delete single reply to thread
    .delete((req,res)=>{
      // console.log("---- DELETE /api/replies/:reply_id ----");
      // console.log(req.body);
      // console.log(req.params);
      // console.log("---- End ----");
    
      var targetThreadID = req.body.thread_id
      var targetReplyID = req.body.reply_id
      
      Thread.findOne( { _id: targetThreadID }, (err, foundThread)=>{
        // console.log('---- foundThread ----')
        // console.log(foundThread)
        // console.log('---- End ----')
        
        err ? console.log("Error finding thread to delete: ", err) : null
        
        var foundReplyIndex = foundThread.replies.findIndex( (reply)=>{ return reply._id == targetReplyID } )
        
        // console.log('---- foundReply ----')
        // console.log(foundThread.replies[foundReplyIndex])
        // console.log('---- End ----')
        
        foundThread.replies[foundReplyIndex].verifyDelete_password(req.body.delete_password)
          .then(function(valid) {
            if (valid) {
              //Thread.deleteOne({ _id: targeThreadtID  }, (err)=>{ res.send('Thread ID: ' +targetThreadID+ " has been deleted."); })
              foundThread.replies.splice(foundReplyIndex,1)
              foundThread.save((err)=>{
                err ? console.log("Error saving thread after deleting reply: ", err) : res.send('Reply ID: ' +targetReplyID+ " has been deleted.");
              })
            } else {
              res.send('Reply ID: ' +targetReplyID+ " has not been deleted, incorrect password.");
            }
          })
          .catch(function(err) {
            err ? console.log("Error deleting thread: ", err) : null
          });
      });
    });
    

};


//         foundThread.verifyDelete_password(req.body.delete_password)