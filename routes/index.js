
/*
 * GET home page.
 */
var fs = require ('fs.extra');
exports.index = function(req, res){
    res.render('index', { title: 'Express' });
    
};
exports.helloworld = function(req, res){
    res.render('helloworld', { title: 'Hello, World!' });
};

exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('users');
        collection.find({},{},function(e,docs){
                        res.render('userlist', {
                                   "userlist" : docs
                                   });
                        
                        });
    };
};


exports.newuser = function(req, res){
     res.render('newuser', { title: 'Add New User' });
}

exports.adduser = function(db){
    return function(req, res){
        var userName = req.body.username;
        var userEmail = req.body.useremail;
        var uploadedfilepath = req.files.image.path;
        var uploadedfilename = req.files.image.originalFilename;
        var image = req.files.image;
        
        var uploadedfilepathsplit= req.files.image.path.split('/');
        var newPath = __dirname +'/public/images/' + uploadedfilepathsplit[(uploadedfilepathsplit.length - 1)];
        var imageSrc = uploadedfilepathsplit[(uploadedfilepathsplit.length - 1)];
        
        //console.log("NEW PATH: " +newPath);
        fs.copy(uploadedfilepath, newPath, function(err) {
                                                            if(err) {
                                                                    console.log(err);
                                                                    throw err;
                                                                    }
                                                          fs.unlink(uploadedfilepath, function() {
                                                                                            if (err) throw err;
                                                                    });
                                                                    
                });

     
        
        var collection = db.get('users');
        collection.insert({
                          "username" : userName,
                          "email" : userEmail,
                          "image" : image,
                          "temppath" : newPath,
                          "uploadedfilename" :imageSrc
                          }, function (err, doc) {
                          if (err) {
                          // If it failed, return error
                          res.send("There was a problem adding the information to the database.");
                          }
                          else {
                          res.location("userlist");
                          // And forward to success page
                          res.redirect("userlist");
                          }
                          }
                          );
    }
}

