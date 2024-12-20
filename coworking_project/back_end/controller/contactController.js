import Contact from "../models/contact.js";

// Get all contacts
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find(); // Fetch all contacts from the database
    res.status(200).json(contacts); // Respond with the contacts
  } catch (err) {
    next(err); // Handle errors
  }
};
