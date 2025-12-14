import { Router } from 'express';

const router = Router();

// GET users (no SQL)
router.get('/', async (req, res) => {
  res.json({
    success: true,
    message: "MySQL disabled — no users available.",
    data: []
  });
});

// POST load users from JSON (no SQL)
router.post('/load-from-file', async (req, res) => {
  res.json({
    success: false,
    message: "MySQL disabled — cannot load users from file."
  });
});

// POST create user (no SQL)
router.post('/', async (req, res) => {
  res.json({
    success: false,
    message: "MySQL disabled — cannot create user."
  });
});

// DELETE clear users (no SQL)
router.delete('/clear', async (req, res) => {
  res.json({
    success: false,
    message: "MySQL disabled — cannot clear users."
  });
});

export default router;
