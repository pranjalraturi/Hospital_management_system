const express = require('express');
const router = express.Router();
const DoctorVisit = require('../models/DoctorVisit');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/doctorvisits
// @desc    Get all doctor visits
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const visits = await DoctorVisit.find()
      .populate('pat_id', 'user_id medical_problem')
      .populate('doctor_id', 'user_id charges');
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/doctorvisits/doctor/:doctorId
// @desc    Get visits by doctor ID
// @access  Private
router.get('/doctor/:doctorId', auth, async (req, res) => {
  try {
    const visits = await DoctorVisit.find({ doctor_id: req.params.doctorId })
      .populate('pat_id', 'user_id medical_problem')
      .populate('doctor_id', 'user_id charges');
    
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/doctorvisits/patient/:patientId
// @desc    Get visits by patient ID
// @access  Private
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    const visits = await DoctorVisit.find({ pat_id: req.params.patientId })
      .populate('pat_id', 'user_id medical_problem')
      .populate('doctor_id', 'user_id charges');
    
    res.json(visits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/doctorvisits
// @desc    Add new doctor visit
// @access  Private
router.post('/', [
  auth,
  [
    check('pat_id', 'Patient ID is required').not().isEmpty(),
    check('doctor_id', 'Doctor ID is required').not().isEmpty(),
    check('visits', 'Visit information is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pat_id, doctor_id, visits } = req.body;

  try {
    // Check if patient exists
    const patient = await Patient.findById(pat_id);
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    // Check if this visit already exists
    const existingVisit = await DoctorVisit.findOne({ 
      pat_id, 
      doctor_id,
      visits: visits 
    });

    if (existingVisit) {
      return res.status(400).json({ msg: 'This visit record already exists' });
    }

    const newVisit = new DoctorVisit({
      pat_id,
      doctor_id,
      visits
    });

    const visit = await newVisit.save();
    
    // Populate the response
    const populatedVisit = await DoctorVisit.findById(visit._id)
      .populate('pat_id', 'user_id medical_problem')
      .populate('doctor_id', 'user_id charges');
    
    res.json(populatedVisit);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/doctorvisits/:id
// @desc    Update doctor visit
// @access  Private
router.put('/:id', [
  auth,
  [
    check('visits', 'Visit information is required').optional().not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let visit = await DoctorVisit.findById(req.params.id);
    
    if (!visit) {
      return res.status(404).json({ msg: 'Visit record not found' });
    }

    // Check if user is authorized (admin, the doctor, or staff)
    if (req.user.role !== 'admin' && 
        req.user.role !== 'doctor' && 
        req.user.role !== 'staff') {
      return res.status(401).json({ msg: 'Not authorized to update visit records' });
    }

    // Update visits field if it exists in the request
    if (req.body.visits) visit.visits = req.body.visits;
    
    await visit.save();
    
    // Populate the response
    const populatedVisit = await DoctorVisit.findById(visit._id)
      .populate('pat_id', 'user_id medical_problem')
      .populate('doctor_id', 'user_id charges');
    
    res.json(populatedVisit);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Visit record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/doctorvisits/:id
// @desc    Delete doctor visit
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to delete visit records' });
    }

    const visit = await DoctorVisit.findById(req.params.id);
    
    if (!visit) {
      return res.status(404).json({ msg: 'Visit record not found' });
    }
    
    await visit.remove();
    res.json({ msg: 'Visit record removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Visit record not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;