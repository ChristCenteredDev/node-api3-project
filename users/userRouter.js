const express = require('express');
const User = require('./userDb.js');
const Post = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const { name } = req.body;
  User.insert({ name })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'Error inserting user' });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const post = req.body;

  Post.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'error adding post' });
    });
});

router.get('/', (req, res) => {
  User.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'Error getting users' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.user;
  User.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'Error getting user posts' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.user;
  User.remove(id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'Error deleting user' });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  User.update(id, { name })
    .then(() => {
      User.getById(id)
        .then(user => res.status(200).json(user))
        .catch(err => {
          console.log(err);
          res.status(500).json({ errorMessage: 'Error getting user' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'Error updating user' });
    });
});

//custom middleware

function verifyUserID(id, cb) {
  User.getById(id).then(user => {
    if (user) {
      cb();
    } else {
      res.status(404).json({ errorMessage: "User with ID doesn't exist" });
    }
  });
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ errorMessage: "User with ID doesn't exist" });
    }
  });
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ errorMessage: 'Name required' });
  }

  if (typeof name !== 'string') {
    return res.status(400).json({ errorMessage: 'Name must be a string' });
  }

  next();
}

function validatePost(req, res, next) {
  const { id: user_id } = req.params;
  const { text } = req.body;

  if (!req.body) {
    return res.status(400).json({ errorMessage: 'Post requires body' });
  }

  if (!text) {
    return res.status(400).json({ errorMessage: 'Post requires text' });
  }

  req.body = { user_id, text };
  next();
}

module.exports = router;
