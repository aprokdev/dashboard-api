import express from 'express';

const userRouter = express.Router();

userRouter.use((req, res, next) => {
    console.log('Callback /users router');
    next();
})

userRouter.post('/login', (req, res) => {
    res.send('Login');
});

userRouter.post('/register', (req, res) => {
    res.send('register');
});

export { userRouter };
