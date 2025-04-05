const express = require('express');
const router = express.Router();
const Ward = require('../models/Ward');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/wards
// @desc    Get all wards
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/wards/:id
// @desc    Get ward by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    
    if (!ward) {
      return res.status(404).json({ msg: 'Ward not found' });
    }
    
    res.json(ward);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ward not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/wards
// @desc    Add new ward
// @access  Private (Admin only)
router.post('/', [
  auth,
  [
    check('type', 'Ward type is required').not().isEmpty(),
    check('charges', 'Charges must be a number').isNumeric(),
    check('availability', 'Availability status is required').isBoolean(),
    check('max_cap', 'Maximum capacity must be a number').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, charges, availability, max_cap } = req.body;

  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to add wards' });
    }

    const newWard = new Ward({
      type,
      charges,
      availability,
      max_cap
    });

    const ward = await newWard.save();
    res.json(ward);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/wards/:id
// @desc    Update ward
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  [
    check('type', 'Ward type is required').optional().not().isEmpty(),
    check('charges', 'Charges must be a number').optional().isNumeric(),
    check('availability', 'Availability status is required').optional().isBoolean(),
    check('max_cap', 'Maximum capacity must be a number').optional().isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to update wards' });
    }

    const ward = await Ward.findById(req.params.id);
    
    if (!ward) {
      return res.status(404).json({ msg: 'Ward not found' });
    }
    
    // Update fields if they exist in the request
    if (req.body.type) ward.type = req.body.type;
    if (req.body.charges !== undefined) ward.charges = req.body.charges;
    if (req.body.availability !== undefined) ward.availability = req.body.availability;
    if (req.body.max_cap !== undefined) ward.max_cap = req.body.max_cap;
    
    await ward.save();
    res.json(ward);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ward not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/wards/:id
// @desc    Delete ward
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to delete wards' });
    }

    const ward = await Ward.findById(req.params.id);
    
    if (!ward) {
      return res.status(404).json({ msg: 'Ward not found' });
    }
    
    await ward.remove();
    res.json({ msg: 'Ward removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ward not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/wards/available
// @desc    Get all available wards
// @access  Private
router.get('/status/available', auth, async (req, res) => {
  try {
    const wards = await Ward.find({ availability: true });
    res.json(wards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;