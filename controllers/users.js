var mongoose = require("mongoose");
var User = require("../models/user");
var passport = require("passport");
var crypto = require("crypto");
var postmark = require("postmark");
var async = require("async");
var client = new postmark.Client(
  "99524476-87e5-4b8c-b838-b143918a9a23"
);

module.exports = {
  getUsers: function(req, res) {
    var firstName = req.params.firstName;
    User.find(function(err, users) {
      if (err) return console.error(err);
      res.send(users);
    });
  },

  getUserProfile: function(req, res) {
    var username = req.params.username;
    User.find(function(err, users) {
      if (err) return console.error(err);
      res.send(users);
    });
  },

  postUser: function(req, res) {
    User.find({email: req.body.email}, function(err, user){
      if(err){
        return res.status(500).json({
          message: err
        });
      }
      if(user.length > 0){
        if(user[0].email == req.body.email){
          return res.status(401).json({
            message: "A user with the given email is already registered."
          });
        }
      }
      if(user.length < 1){
         User.register(
            new User({
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              email: req.body.email,
              username: req.body.userName
            }),
            req.body.password,
            function(err, account) {
              if (err) {
                return res.status(401).json({
                  err: err
                });
              } else {
                return res.status(200).json({
                  message: "User Created"
                });
              }
            }
          );
      }
    })
  },

  updateUser: function(req, res) {
    var query = { _id: req.body._id };
    var updateUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username
    };
    if (
      !updateUser.firstname ||
      !updateUser.lastname ||
      !updateUser.email ||
      !updateUser.username
    ) {
      return res.status(401).json({
        message: "One or more fields are empty"
      });
    } else {
      User.update(query, updateUser, function(err, result) {
        if (err) {
          return res.status(401).json({
            err: err,
            message: "User not Updated"
          });
        }
        if (result) {
          return res.status(200).json({
            success: result,
            message: "User Updated"
          });
        }
      });
    }
  },

  changePass: function(req, res) {
    var oldPassword = req.body.oldPassword;
    var confirmNewPassword = req.body.confirmNewPassword;
    User.findById(req.user._id, function(err, user) {
      if (err) {
        return next(err);
      }
      user.changePassword(oldPassword, confirmNewPassword, function(
        changePassErr,
        user
      ) {
        if (changePassErr) {
          return res.status(500).json({
            message: changePassErr
          });
        }
        return res.status(200).json({
          message: "Password has been updated"
        });
      });
    });
  },

  forgotPass: function(req, res) {
    async.waterfall(
      [
        function(done) {
          crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString("hex");
            done(err, token);
          });
        },
        function(token, done) {
          User.findOne({ username: req.body.username }, function(err, user) {
            if (err) {
              return res.status(500).json({
                message: err
              });
            }
            if (!user) {
              return res.status(500).json({
                message: "No user with that username"
              });
            }
            if (user) {
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

              user.save(function(err) {
                done(err, token, user);
              });
            }
          });
        },
        function(token, user, done) {
          client.sendEmailWithTemplate({
            From: "rene.osman@nih.gov",
            To: user.email,
            TemplateId: 4884721,
            TemplateModel: {
              product_name: "Node-Mongo",
              product_url: "http://" + req.headers.host,
              name: user.firstname,
              action_url: "http://" + req.headers.host + "/#/reset/" + token
            }
          });
          if (done) {
            return res.status(200).json({
              message:
                "An email has been sent to " +
                user.email +
                " with further instructions."
            });
          }
        }
      ],
      function(err) {
        return res.status(500).json({
          message: err
        });
      }
    );
  },

  resetPassword: function(req, res) {
    async.waterfall(
      [
        function(done) {
          User.findOne(
            {
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() }
            },
            function(err, user) {
              if (err) {
                return res.status(500).json({
                  message: err
                });
              }
              if (!user) {
                return res.status(500).json({
                  message: "Password reset token is invalid or has expired"
                });
              }
              if (user) {
                user.setPassword(req.body.confirmNewPassword, function(
                  setPasswordErr,
                  user
                ) {
                  if (setPasswordErr) {
                    return res.status(500).json({
                      message: setPasswordErr
                    });
                  }
                  if (user) {
                    user.save(function(err) {
                      req.logIn(user, function(err) {
                        done(err, user);
                      });
                    });
                  }
                });
              }
            }
          );
        },
        function(user, done) {
          return res.status(200).json({
            message: "Password has been updated"
          });
        }
      ],
      function(err) {
        return res.status(500).json({
          message: err
        });
      }
    );
  },

  forgotName: function(req, res) {
    if (!req.body.email) {
      return res.status(500).json({
        message: "You did not enter an email."
      });
    } else {
      async.waterfall(
        [
          function(done) {
            User.findOne(
              {
                email: req.body.email
              },
              function(err, user) {
                if (err) {
                  return res.status(500).json({
                    message: err
                  });
                }
                if (!user) {
                  return res.status(500).json({
                    message: "This email is not registered to a user."
                  });
                }
                if (user) {
                  client.sendEmailWithTemplate({
                    From: "rene.osman@nih.gov",
                    To: user.email,
                    TemplateId: 4888201,
                    TemplateModel: {
                      product_name: "Node-Mongo",
                      product_url: "http://" + req.headers.host,
                      name: user.firstname,
                      username: user.username,
                      action_url: "http://" + req.headers.host + "/#/login"
                    }
                  });
                  return res.status(200).json({
                    message:
                      "An email has been sent to " +
                      user.email +
                      " with further instructions."
                  });
                }
              }
            );
          }
        ],
        function(err) {
          return res.status(500).json({
            message: err
          });
        }
      );
    }
  },

  loginUser: function(req, res) {
    passport.authenticate("local", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          err: info
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.status(500).json({
            err: err,
            message: "Could not log in user"
          });
        }
        res.status(200).json({
          message: "Login successful!"
        });
      });
    })(req, res);
  },

  logoutUser: function(req, res) {
    req.logout();
    res.status(200).json({
      message: "User Logged out",
      user: false
    });
  },

  getuserStatus: function(req, res) {
    if (req.isAuthenticated()) {
      res.status(200).json({
        status: true,
        user: req.user
      });
    }
    if (!req.isAuthenticated()) {
      res.status(200).json({
        status: false,
        user: false
      });
    }
  }
};
