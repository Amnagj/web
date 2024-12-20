import express from 'express';
import Contact from '../models/contact.js'; // Assurez-vous que le modèle est correctement importé
const router = express.Router();

// Route pour gérer la soumission du formulaire de contact


// Route to handle contact form submission
router.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ message: 'There was an error saving your form. Please try again later.' });
  }
});
import { getAllContacts } from "../controller/contactController.js";


router.get("/", getAllContacts);




export default router;
