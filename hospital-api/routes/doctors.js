const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Employee = require('../models/Employee');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all doctors
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/', protect, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
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
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
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
 *         description: Doctor found
 *       404:
 *         description: Doctor not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id: req.params.id });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
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
 * /api/doctors:
 *   post:
 *     summary: Create new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empId
 *               - charges
 *             properties:
 *               empId:
 *                 type: integer
 *               charges:
 *                 type: number
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, admin, async (req, res) => {
  try {
    const { empId, charges } = req.body;
    
    // Check if employee exists
    const employee = await Employee.findOne({ id: empId });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }
    
    // Check if doctor already exists with this empId
    const doctorExists = await Doctor.findOne({ empId });
    if (doctorExists) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already exists with this employee ID',
      });
    }
    
    // Get highest doctor ID and increment by 1
    const highestDoctor = await Doctor.findOne().sort('-id');
    const newId = highestDoctor ? highestDoctor.id + 1 : 1;
    
    const doctor = await Doctor.create({
      id: newId,
      empId,
      charges
    });
    
    res.status(201).json({
      success: true,
      data: doctor,
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
 * /api/doctors/{id}:
 *   put:
 *     summary: Update doctor
 *     tags: [Doctors]
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
 *               charges:
 *                 type: number
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       404:
 *         description: Doctor not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id: req.params.id });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedDoctor,
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
 * /api/doctors/{id}:
 *   delete:
 *     summary: Delete doctor
 *     tags: [Doctors]
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
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ id: req.params.id });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    await Doctor.findOneAndDelete({ id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
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