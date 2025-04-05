const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Get all medicines
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all medicines
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/', protect, async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json({
      success: true,
      count: medicines.length,
      data: medicines,
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
 * /api/medicines/{id}:
 *   get:
 *     summary: Get medicine by ID
 *     tags: [Medicines]
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
 *         description: Medicine found
 *       404:
 *         description: Medicine not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ id: req.params.id });
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    res.status(200).json({
      success: true,
      data: medicine,
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
 * /api/medicines:
 *   post:
 *     summary: Create new medicine
 *     tags: [Medicines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Medicine created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price } = req.body;
    
    // Get highest medicine ID and increment by 1
    const highestMedicine = await Medicine.findOne().sort('-id');
    const newId = highestMedicine ? highestMedicine.id + 1 : 1;
    
    const medicine = await Medicine.create({
      id: newId,
      name,
      price
    });
    
    res.status(201).json({
      success: true,
      data: medicine,
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
 * /api/medicines/{id}:
 *   put:
 *     summary: Update medicine
 *     tags: [Medicines]
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
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Medicine updated successfully
 *       404:
 *         description: Medicine not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ id: req.params.id });
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }
    
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedMedicine,
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
 * /api/medicines/{id}:
 *   delete:
 *     summary: Delete medicine
 *     tags: [Medicines]
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
 *         description: Medicine deleted successfully
 *       404:
 *         description: Medicine not found
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ id: req.params.id });
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found',
      });
    }

    await Medicine.findOneAndDelete({ id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully',
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
