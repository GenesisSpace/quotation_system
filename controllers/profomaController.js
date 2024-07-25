const profomaModel = require('../models/profomaModel');

// Function to generate profoma number
const generateProfomaNumber = async () => {
    try {
        const existingProfomaNumbers = await profomaModel.find().distinct('profomaNumber');
        if (existingProfomaNumbers.length === 0) {
            return "ZPRF001";
        } else {
            existingProfomaNumbers.sort();
            const lastProfomaNumber = existingProfomaNumbers[existingProfomaNumbers.length - 1];
            const lastNumber = parseInt(lastProfomaNumber.substring(4));
            const newNumber = lastNumber + 1;
            return "ZPRF" + newNumber.toString().padStart(3, '0');
        }
    } catch (error) {
        console.error('Error generating profoma number:', error);
        throw new Error('Failed to generate profoma number');
    }
};

// Get all profomas
const getProfomaController = async (req, res) => {
    try {
        const profomas = await profomaModel.find();
        res.status(200).json(profomas);
    } catch (error) {
        console.error('Error fetching profomas:', error);
        res.status(500).json({ error: 'Failed to retrieve profomas' });
    }
};

// Add a new profoma
const addProfomaController = async (req, res) => {
    try {
        const profomaNumber = await generateProfomaNumber(); // Generate profoma number

        const newProfoma = new profomaModel({
            ...req.body,
            profomaNumber: profomaNumber,
        });

        await newProfoma.save();
        res.status(201).json({ message: 'Profoma created successfully' });
    } catch (error) {
        console.error('Error creating profoma:', error);
        res.status(500).json({ error: 'Failed to create profoma' });
    }
};

module.exports = { addProfomaController, getProfomaController };
