/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Thread = require("../models/Thread.js");

var currData = [];

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('POST /api/threads/:board', function(done) {
       chai.request(server)
        .post('/api/threads/general')
        .send({
                   text: 'Here is a test thread for review.',
                   delete_password: 'PASSWORD'
              })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.redirects, 'Response sent a redirect.')
          //console.log(res.req.path.slice(res.req.path.lastIndexOf("/")+1,))
          currData.push(res.req.path.slice(res.req.path.lastIndexOf("/")+1,))
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('GET /api/threads/:board', function(done) {
       chai.request(server)
        .get('/api/threads/general')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.text, 'Response redirects to board.');         
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('Delete /api/threads/:board', function(done) {
       chai.request(server)
        .delete('/api/threads/general')
        .send({
                 thread_id : currData[0],
                 delete_password: 'PASSWORD'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.text, 'Response redirects to board.');         
          done();
        });
      });
      
    });
    
    suite('PUT', function() { //5d1b4dfc4786630ad083e688 
      
      test('Put /api/threads/:board', function(done) {
       chai.request(server)
        .put('/api/threads/general')
        .send({
                 thread_id : '5d1b4dfc4786630ad083e688'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.text, 'Response redirects to board.');         
          done();
        });
      });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('POST /api/replies/:board', function(done) {
       chai.request(server)
        .post('/api/replies/general')
        .send({
                  thread_id: '5d1b4dfc4786630ad083e688',
                  text: 'This is a reply for testing purposes. Do not be alarmed.',
                  delete_password: 'PASSWORD'
              })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.text, 'Response is in text.')
         
          Thread.findById('5d1b4dfc4786630ad083e688', (err, foundThread)=>{
            err ? console.log('Error at POST /api/replies/:board while finding thread : ', err) : null
            currData.unshift(foundThread.replies[0]._id);
          })
         
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('GET /api/replies/:board', function(done) {
       chai.request(server)
        .get('/api/replies/5d1b4dfc4786630ad083e688')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.text, 'Response is in text.')
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('Put /api/replies/:board', function(done) {
       chai.request(server)
        .put('/api/replies/general')
        .send({
                 thread_id : '5d1b4dfc4786630ad083e688',
                 reply_id: currData[0]
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.text, 'Response redirects to board.');         
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('Delete /api/replies/:board', function(done) {
       chai.request(server)
        .delete('/api/replies/5d1b4dfc4786630ad083e688')
        .send({
                 thread_id : '5d1b4dfc4786630ad083e688',
                 reply_id: currData[0],
                 delete_password: 'PASSWORD'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isOk(res.text, 'Response redirects to board.');         
          done();
        });
      });
      
    });
    
  });

});
