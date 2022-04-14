const auth = require('../middleware/auth')
const express = require('express')
//const auth = require('../middleware/auth');
//const admin = require('../middleware/admin');
const router = express.Router()
const mongoose = require('mongoose')
const { Category, validate } = require('../models/category')

router.get('/', auth, async (req, res) => {
  const user_id = req.user._id
  const category = await Category.find({ user: user_id })
  res.send(category)
})

router.get('/:id', auth, async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    'user',
    '-password'
  )
  if (!category) {
    return res.status(404).send('The category with the given ID was not found.')
  }
  if (category.user != req.user._id) {
    return res.status(401).send('Trying to get category for different user.')
  }

  res.send(category)
})

router.post('/', auth, async function (req, res) {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const category = new Category(req.body)

  if (category.user != req.user._id) {
    return res
      .status(401)
      .send(
        'Access denied. Trying to add category for different user then logged'
      )
  }
  await category.save()

  res.send(category)
})

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const category = await Category.findById(req.params.id)
  if (!category) {
    return res.status(404).send('The category with the given ID was not found.')
  }
  if (category.user != req.user._id) {
    return res.status(401).send('Trying to get category for different user.')
  }

  category.name = req.body.name

  try {
    await category.save()
    res.send(category)
  } catch (err) {
    console.log('Error ', err)
  }
})

router.delete('/:id', auth, async (req, res) => {
  const cat = await Category.findByIdAndRemove(req.params.id)

  if (!cat) {
    return res.status(404).send('The genre with the given ID was not found.')
  }

  // checking if logged user is owner
  if (cat.user != req.user._id) {
    return res
      .status(401)
      .send('Access denied. User not authorized to this category.')
  }

  res.send(cat)
})

module.exports = router
