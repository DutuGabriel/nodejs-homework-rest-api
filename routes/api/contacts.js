const express = require("express");
const router = express.Router();

const contacts = require("../../models/contacts");
const {
  contactSchema,
  updateSchema,
  updateFavoriteSchema,
} = require("../../models/contactsSchemas");

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);

    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { name, email, phone } = req.body;
    const result = await contacts.addContact({ name, email, phone });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);

    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = updateSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }

    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);

    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { error, value } = updateFavoriteSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { contactId } = req.params;
    const { favorite } = value;

    const result = await contacts.updateStatusContact(contactId, { favorite });

    if (!result) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
