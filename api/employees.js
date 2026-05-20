const { connectToDatabase } = require('./_utils/db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection('employees');

  switch (method) {
    case 'GET':
      try {
        const employees = await collection.find({}).toArray();
        res.status(200).json(employees);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employees' });
      }
      break;

    case 'POST':
      try {
        const { name, email } = req.body;
        if (!name || !email) {
          return res.status(400).json({ error: 'Name and email are required' });
        }
        const result = await collection.insertOne({ name, email });
        res.status(201).json({ _id: result.insertedId, name, email });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add employee' });
      }
      break;

    case 'PUT':
      try {
        const { id, name, email } = req.body;
        if (!id || !name || !email) {
          return res.status(400).json({ error: 'ID, name, and email are required' });
        }
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: { name, email } });
        res.status(200).json({ message: 'Employee updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update employee' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: 'Employee deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete employee' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
