const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { protect, admin, doctor } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all patients
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/', protect, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient found
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/patients/doctor/{doctorId}:
 *   get:
 *     summary: Get patients by doctor ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of patients for the doctor
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/doctor/:doctorId', protect, async (req, res) => {
  try {
    const patients = await Patient.find({ doctorId: req.params.doctorId });
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create new patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - doctorId
 *               - dateOfAdm
 *               - bloodGroup
 *               - dob
 *               - patientProblem
 *             properties:
 *               userId:
 *                 type: integer
 *               wardId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               dateOfAdm:
 *                 type: string
 *                 format: date
 *               bloodGroup:
 *                 type: string
 *                 enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *               dob:
 *                 type: string
 *                 format: date
 *               prescription:
 *                 type: string
 *               bedAllocated:
 *                 type: integer
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, partial]
 *               patientProblem:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, async (req, res) => {
  try {
    const { userId, wardId, doctorId, dateOfAdm, bloodGroup, dob, prescription, bedAllocated, paymentStatus, patientProblem } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Check if doctor exists
    const doctor = await Doctor.findOne({ id: doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    
    // Get highest patient ID and increment by 1
    const highestPatient = await Patient.findOne().sort('-id');
    const newId = highestPatient ? highestPatient.id + 1 : 1;
    
    const patient = await Patient.create({
      id: newId,
      userId,
      wardId,
      doctorId,
      dateOfAdm,
      bloodGroup,
      dob,
      prescription,
      bedAllocated,
      paymentStatus,
      patientProblem
    });
    
    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wardId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               prescription:
 *                 type: string
 *               bedAllocated:
 *                 type: integer
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, partial]
 *               patientProblem:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }
    
    // Check if doctor exists if doctorId is provided
    if (req.body.doctorId) {
      const doctor = await Doctor.findOne({ id: req.body.doctorId });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found',
        });
      }
    }
    
    const updatedPatient = await Patient.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    await Patient.findOneAndDelete({ id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;
