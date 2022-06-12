const { expectCt } = require('helmet')
const request = require('supertest')
const { Category } = require('../../models/category')
const { User } = require('../../models/user')
const mongoose = require('mongoose')

let server

describe('/api/categories', () => {
  beforeEach(() => {
    server = require('../../index')
  })
  afterEach(async () => {
    server.close()
    await Category.remove({})
  })

  describe('GET /', () => {
    it('should return 401 (access denied) if not logged in', async () => {
      const res = await request(server).get('/api/categories')
      expect(res.status).toBe(401)
    })

    it('should return list of categories when logged in', async () => {
      // logging user
      const user = new User()
      const token = user.generateAuthToken()

      const categories = [
        { name: 'testowa_kategoria1', user: user._id },
        { name: 'testowa_kategoria2', user: user._id },
      ]

      await Category.collection.insertMany(categories)

      const res = await request(server)
        .get('/api/categories')
        .set('x-auth-token', token)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some((c) => c.name === 'testowa_kategoria1')).toBeTruthy()
      expect(res.body.some((c) => c.name === 'testowa_kategoria2')).toBeTruthy()
    })
  })

  describe('POST /', () => {
    it('should return 401 if client is not logged in', async () => {
      const test_object = {
        name: 'testowa kategoria',
      }
      const res = await request(server)
        .post('/api/categories')
        .send(test_object)
      expect(res.status).toBe(401)
    })

    it('should return 400 if name is less than 3 chars', async () => {
      const token = new User().generateAuthToken()

      const test_object = {
        name: 'AB',
      }
      const res = await request(server)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send(test_object)

      expect(res.status).toBe(400)
    })

    it('should return 401 if adding category for not currently logged in user', async () => {
      const user = new User()
      const token = user.generateAuthToken()
      const test_object = {
        name: 'testowa_kategoria',
        user: '61e35302b28660a3832b1563', //other id of user, not the current logged one
      }
      const res = await request(server)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send(test_object)
      expect(res.status).toBe(401)
    })

    it('should return 200 after save', async () => {
      const user = new User()
      const token = user.generateAuthToken()
      const test_object = {
        name: 'testowa_kategoria',
        user: user._id,
      }
      const res = await request(server)
        .post('/api/categories')
        .set('x-auth-token', token)
        .send(test_object)
      expect(res.status).toBe(200)
      expect(res.body.name).toContain(test_object.name)
      expect(res.body.user).toContain(test_object.user.toString())
    })
  })

  describe('DELETE /:id', () => {
    let token
    let category
    let id
    let user

    const exec = async () => {
      return await request(server)
        .delete('/api/categories/' + id)
        .set('x-auth-token', token)
        .send()
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      user = new User({ isAdmin: true })
      token = user.generateAuthToken()

      category = new Category({ name: 'genre1', user: user._id })
      await category.save()

      id = category._id
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    // it('should return 403 if the user is not an admin', async () => {
    //   token = new User({ isAdmin: false }).generateAuthToken()

    //   const res = await exec()

    //   expect(res.status).toBe(403)
    // })

    // it('should return 404 if id is invalid', async () => {
    //   id = 1

    //   const res = await exec()
    //   expect(res.status).toBe(404)
    // })

    it('should return 404 if no category with the given id was found', async () => {
      id = mongoose.Types.ObjectId()

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should delete the category if input is valid', async () => {
      await exec()

      const categoryInDb = await Category.findById(id)

      expect(categoryInDb).toBeNull()
    })

    it('should return the removed category', async () => {
      const res = await exec()

      expect(res.body).toHaveProperty('_id', category._id.toHexString())
      expect(res.body).toHaveProperty('name', category.name)
    })
  })
})
