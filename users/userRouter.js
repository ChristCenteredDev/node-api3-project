const express = require('express');
const User = require('./userDb.js');

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
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

router.get('/:id', (req, res) => {
  const { id } = req.params;
  User.getById(id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ errorMessage: "User with ID doesn't exist" });
    }
  });
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  User.getById(id).then(user => {
    if (user) {
      User.update(id, { name }).then(updated => {
        res.status(200).json(updated);
      });
    } else {
      res.status(404).json({ errorMessage: "User with ID doesn't exist" });
    }
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
