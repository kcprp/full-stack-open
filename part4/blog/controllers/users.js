const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
  const { username, name, password } = await request.body

  if (!password) {
    response.status(400).send({ error: 'Password is required' })
  }

  if (password.length < 3) {
    response.status(400).send({ error: 'Password must be at least 3 characters long' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })
  
  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter