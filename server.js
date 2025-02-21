import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const checkEngineerRole = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'engineer') {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    } catch (error) {
        res.status(500).send(error);
    }
};


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },  // 'user' or 'engineer'
    favorites: [{ type: String }],  // Array of album IDs
    reviews: [{
        albumId: { type: String, required: true },
        review: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }],
    comments: [{
        albumId: { type: String, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

app.get('/api/favorites', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.favorites);
    } catch (error) {
        res.status(500).send(error);
    }
});

const User = mongoose.model('User', userSchema);




app.post('/api/reviews', async (req, res) => {
    const { albumId, review } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingReview = user.reviews.find(r => r.albumId === albumId);
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this album' });
        }

        user.reviews.push({ albumId, review });
        await user.save();

        res.json(user.reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/albums/:albumId/reviews', async (req, res) => {
    const { albumId } = req.params;

    try {
        const users = await User.find({ 'reviews.albumId': albumId });
        const reviews = users.flatMap(user => user.reviews.filter(review => review.albumId === albumId));

        res.json(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/albums/:albumId/comments', async (req, res) => {
    const { albumId } = req.params;

    try {
        const users = await User.find({ 'comments.albumId': albumId });
        const comments = users.flatMap(user => user.comments.filter(comment => comment.albumId === albumId));

        res.json(comments);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role: role || 'user' });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/api/favorites', async (req, res) => {
    const { albumId } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.favorites.includes(albumId)) {
            user.favorites.push(albumId);
            await user.save();
        }

        res.json(user.favorites);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/comments', async (req, res) => {
    const { albumId, comment } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.comments.push({ albumId, comment });
        await user.save();

        res.json(user.comments);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/protected', checkEngineerRole, (req, res) => {
    res.json({ message: 'This is a protected route for engineers only' });
});


app.put('/api/reviews', async (req, res) => {
    const { albumId, review } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingReview = user.reviews.find(r => r.albumId === albumId);
        if (!existingReview) {
            return res.status(400).json({ error: 'Review not found' });
        }

        existingReview.review = review;
        await user.save();

        res.json(user.reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/api/reviews', async (req, res) => {
    const { albumId } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.reviews = user.reviews.filter(r => r.albumId !== albumId);
        await user.save();

        res.json(user.reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
