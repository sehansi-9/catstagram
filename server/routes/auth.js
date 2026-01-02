import express from 'express';
const router = express.Router();
import { signup, signin } from '../services/authService.js';

router.post('/signup', async (req, res) => {
    const { name, email, password, pic } = req.body;
    try {
        const result = await signup(name, email, password, pic);
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});


router.post('/signin', async (req, res) => {
    const { name, password } = req.body;
    try {
        const result = await signin(name, password);
        res.json(result);
    } catch (err) {
        return res.status(422).json({ error: err.message });
    }
});


export default router;

