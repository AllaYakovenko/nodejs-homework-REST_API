const express = require('express');
const Joi = require("joi");
const contacts = require("../../models/contacts");
const router = express.Router();
const HttpError = require('../../helpers/HttpError');

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
})

const updateSchema = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()

})

router.get('/', async (req, res, next) => {
  try {
      const result = await contacts.listContacts();
      res.json(result)
  }
  catch(error) { 
      next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try { 
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) { 
      throw HttpError(404, "Not found");
    }
    res.json(result)

  }
  catch (error) { 
      next(error)
  }

})

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) { 
      throw HttpError(400, "missing required name field");
    }
      const result = await contacts.addContact(req.body);
      res.status(201).json(result);
  }
  catch(error) { 
      next(error)
  }

})

router.delete('/:id', async (req, res, next) => {
  try { 
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) { 
      throw HttpError(404, "Not found");
    }  
    res.json({
      message: "contact deleted"
    })

  }
  catch(error) { 
      next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);
    if (keys.length === 0) {
      throw HttpError(400, "missing fields");
    }
      const { error } = updateSchema.validate(req.body);
    if (error) { 
      throw HttpError(400, error.message);
      }
    const { id } = req.params;
      const result = await contacts.updateContact(id, req.body);
    if (!result) { 
      throw HttpError(404, "Not found");
    }
      res.json(result)
  }
  catch(error) { 
      next(error)
  }
})

module.exports = router


