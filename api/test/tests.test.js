const request = require('supertest');
const app = "http://localhost:8000"

describe('Testing api/auth', () => {
    it('Should not login a unregistered user', async () => {
        const details = { username: 'test', password: 'password' }
        const response = await request(app).post('/api/auth/login').send(details)
        expect(response.status).toBe(404)
    })
    it('Should register a new user', async () => {
        const details = { username: 'test', password: 'password', email: 'test' , name: 'test'}
        const response = await request(app).post('/api/auth/register').send(details)
        expect(response.status).toBe(200)
    })
    it('Should not register a user with existing username', async () => {
        const details = { username: 'test', password: 'password', email: 'test' , name: 'test'}
        const response = await request(app).post('/api/auth/register').send(details)
        expect(response.status).toBe(409)
    })
    it('Should not login a registered user with wrong password or username', async () => {
        const details = { username: 'test', password: 'passwords' }
        const response = await request(app).post('/api/auth/login').send(details)
        expect(response.status).toBe(400)
    })
    it('Should login a registered user', async () => {
        const details = { username: 'test', password: 'password' }
        const response = await request(app).post('/api/auth/login').send(details)
        expect(response.status).toBe(200)
    })
    it('Should logout', async () => {
        const details = { username: 'test', password: 'password' }
        const response = await request(app).post('/api/auth/logout').send(details)
        expect(response.status).toBe(200)
    })
})

describe('Testing api/users', () => {
    it('Should not update a user who is not logged in', async () => {
        const details = { name: "test", city: "bangalore", website: "", profilePic: "", coverPic: "" }
        const response = await request(app).put('/api/users').send(details)
        expect(response.status).toBe(401)
    })
})

describe('Testing api/relationships', () => {
    it('Should not follow a user by a user who is not logged in', async () => {
        const details = { userId: "1" }
        const response = await request(app).post('/api/relationships').send(details)
        expect(response.status).toBe(401)
    })
    it('Should not unfollow a user by a user who is not logged in', async () => {
        const details = { userId: "1" }
        const response = await request(app).delete('/api/relationships').send(details)
        expect(response.status).toBe(401)
    })
})

describe('Testing api/posts', () => {
    it('Should not fetch posts by a user who is not logged in', async () => {
        const details = { userId: "1" }
        const response = await request(app).get('/api/posts').send(details)
        expect(response.status).toBe(401)
    })
    it('Should not create post by a user who is not logged in', async () => {
        const details = { desc: "" , img: ""}
        const response = await request(app).post('/api/posts').send(details)
        expect(response.status).toBe(401)
    })
    it('Should not delete post by a user who is not logged in', async () => {
        const details = { userId: "1" }
        const response = await request(app).delete('/api/posts/1').send(details)
        expect(response.status).toBe(401)
    })
})

describe('Testing api/comments', () => {
    it('Should not post comment by a user who is not logged in', async () => {
        const details = { postId: "1" , desc: ""}
        const response = await request(app).post('/api/comments').send(details)
        expect(response.status).toBe(401)
    })
    it('Should not delete comment by a user who is not logged in', async () => {
        const details = { commentId: "1" }
        const response = await request(app).delete('/api/comments/1').send(details)
        expect(response.status).toBe(401)
    })
})

describe('Testing api/likes', () => {
    it('Should not like by a user who is not logged in', async () => {
        const details = { postId: "1"}
        const response = await request(app).post('/api/likes').send(details)
        expect(response.status).toBe(401)
    })
    it('Should not delete like by a user who is not logged in', async () => {
        const details = { postId: "1"}
        const response = await request(app).delete('/api/likes').send(details)
        expect(response.status).toBe(401)
    })
})