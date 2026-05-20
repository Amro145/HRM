const { connectToDatabase } = require('./_utils/db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection('performance');

  switch (method) {
    case 'GET':
      try {
        const performance = await collection.find({}).toArray();
        res.status(200).json(performance);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch performance records' });
      }
      break;

    case 'POST':
      try {
        const { name, rating } = req.body;
        if (!name || !rating) {
          return res.status(400).json({ error: 'Name and rating are required' });
        }
        const result = await collection.insertOne({ name, rating });
        res.status(201).json({ _id: result.insertedId, name, rating });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add performance record' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: 'Performance record deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete performance record' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
