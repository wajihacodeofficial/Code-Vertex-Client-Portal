const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Users & Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = result.rows[0];
        res.json({ 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role, 
            status: user.status 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/signup', async (req, res) => {
    const { name, email, role, phone, passwordHash } = req.body;
    const mappedRole = role || 'client';
    const status = mappedRole === 'client' ? 'approved' : 'pending';
    const pass = passwordHash || 'temporary_pass';

    try {
        const result = await db.query(
            'INSERT INTO users (name, email, role, status, phone, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, name, role, status',
            [name, email, mappedRole, status, phone, pass]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const result = await db.query('SELECT id, email, name, role, status FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Projects Endpoints
app.get('/api/projects', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM projects');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', async (req, res) => {
    const { name, description, type, client_id, deadline } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO projects (name, description, type, client_id, deadline) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, description, type, client_id, deadline]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Code Vertex Platform Server running on port ${PORT}`);
});
