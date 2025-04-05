const express = require('express');
const router = express.Router();
const MedicineAssigned = require('../models/MedicineAssigned');
const Patient = require('../models/Patient');
const Medicine = require('../models/Medicine');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/medicinesassigned
// @desc    Get all medicines assigned
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const medicinesAssigned = await MedicineAssigned.find()
      .populate('pat_id', 'user_id medical_problem')
      .populate('medicine_id', 'name price');
    res.json(medicinesAssigned);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/medicinesassigned/patient/:patientId
// @desc    Get medicines assigned to a patient
// @access  Private
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const medicinesAssigned = await MedicineAssigned.find({ pat_id: req.params.patientId })
      .populate('pat_id', 'user_id medical_problem')
      .populate('medicine_id', 'name price');
    
    res.json(medicinesAssigned);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/medicinesassigned/medicine/:medicineId
// @desc    Get all patients assigned a specific medicine
// @access  Private
router.get('/medicine/:medicineId', auth, async (req, res) => {
  try {
    const medicinesAssigned = await MedicineAssigned.find({ medicine_id: req.params.medicineId })
      .populate('pat_id', 'user_id medical_problem')
      .populate('medicine_id', 'name price');
    
    res.json(medicinesAssigned);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/medicinesassigned
// @desc    Assign medicine to patient
// @access  Private
router.post('/', [
  auth,
  [
    check('pat_id', 'Patient ID is required').not().isEmpty(),
    check('medicine_id', 'Medicine ID is required').not().isEmpty(),
    check('prescription', 'Prescription details are required').not().isEmpty(),
    check('medicine_qty', 'Medicine quantity is required').isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pat_id, medicine_id, prescription, medicine_qty } = req.body;

  try {
    // Check if user is authorized (doctor, admin, or staff)
    if (req.user.role !== 'doctor' && 
        req.user.role !== 'admin' && 
        req.user.role !== 'staff') {
      return res.status(401).json({ msg: 'Not authorized to assign medicines' });
    }

    // Check if patient exists
    const patient = await Patient.findById(pat_id);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Check if medicine exists
    const medicine = await Medicine.findById(medicine_id);
    if (!medicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }

    // Check if this assignment already exists
    const existingAssignment = await MedicineAssigned.findOne({ 
      pat_id, 
      medicine_id 
    });

    if (existingAssignment) {
      // Update quantity instead of creating new record
      existingAssignment.medicine_qty += medicine_qty;
      existingAssignment.prescription = prescription;
      
      await existingAssignment.save();
      
      // Populate the response
      const populatedAssignment = await MedicineAssigned.findById(existingAssignment._id)
        .populate('pat_id', 'user_id medical_problem')
        .populate('medicine_id', 'name price');
      
      return res.json(populatedAssignment);
    }

    const newAssignment = new MedicineAssigned({
      pat_id,
      medicine_id,
      prescription,
      medicine_qty
    });

    const assignment = await newAssignment.save();
    
    // Populate the response
    const populatedAssignment = await MedicineAssigned.findById(assignment._id)
      .populate('pat_id', 'user_id medical_problem')
      .populate('medicine_id', 'name price');
    
    res.json(populatedAssignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/medicinesassigned/:id
// @desc    Update medicine assignment
// @access  Private
router.put('/:id', [
  auth,
  [
    check('prescription', 'Prescription details are required').optional().not().isEmpty(),
    check('medicine_qty', 'Medicine quantity is required').optional().isNumeric()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is authorized (doctor, admin, or staff)
    if (req.user.role !== 'doctor' && 
        req.user.role !== 'admin' && 
        req.user.role !== 'staff') {
      return res.status(401).json({ msg: 'Not authorized to update medicine assignments' });
    }

    let assignment = await MedicineAssigned.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Medicine assignment not found' });
    }
    
    // Update fields if they exist in the request
    if (req.body.prescription) assignment.prescription = req.body.prescription;
    if (req.body.medicine_qty !== undefined) assignment.medicine_qty = req.body.medicine_qty;
    
    await assignment.save();
    
    // Populate the response
    const populatedAssignment = await MedicineAssigned.findById(assignment._id)
      .populate('pat_id', 'user_id medical_problem')
      .populate('medicine_id', 'name price');
    
    res.json(populatedAssignment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Medicine assignment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/medicinesassigned/:id
// @desc    Remove medicine assignment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is authorized (doctor, admin, or staff)
    if (req.user.role !== 'doctor' && 
        req.user.role !== 'admin' && 
        req.user.role !== 'staff') {
      return res.status(401).json({ msg: 'Not authorized to delete medicine assignments' });
    }

    const assignment = await MedicineAssigned.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ msg: 'Medicine assignment not found' });
    }
    
    await assignment.remove();
    res.json({ msg: 'Medicine assignment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Medicine assignment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;