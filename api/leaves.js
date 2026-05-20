const { connectToDatabase } = require('./_utils/db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection('leaves');

  switch (method) {
    case 'GET':
      try {
        const leaves = await collection.find({}).toArray();
        res.status(200).json(leaves);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leave records' });
      }
      break;

    case 'POST':
      try {
        const { name, date, type } = req.body;
        if (!name || !date || !type) {
          return res.status(400).json({ error: 'Name, date, and type are required' });
        }
        const result = await collection.insertOne({ name, date, type });
        res.status(201).json({ _id: result.insertedId, name, date, type });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add leave record' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: 'Leave record deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete leave record' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
