const fs = require('fs/promises');

const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
}

const getContactById = async (id) => {
  const contactsId = String(id);
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === contactsId);
  return result || null;
}

const removeContact = async (id) => {
  const contactsId = String(id);
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === contactsId);
  if (index === -1) { 
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

const addContact = async (data) => {
  const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      ...data,
  }
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContact = async (id, data) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) { 
    return null;
  }
  contacts[index] = { ...contacts[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
