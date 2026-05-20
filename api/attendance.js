const { connectToDatabase } = require('./_utils/db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection('attendance');

  switch (method) {
    case 'GET':
      try {
        const attendance = await collection.find({}).toArray();
        res.status(200).json(attendance);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch attendance records' });
      }
      break;

    case 'POST':
      try {
        const { name, date, status } = req.body;
        if (!name || !date || !status) {
          return res.status(400).json({ error: 'Name, date, and status are required' });
        }
        const result = await collection.insertOne({ name, date, status });
        res.status(201).json({ _id: result.insertedId, name, date, status });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add attendance record' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: 'Attendance record deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete attendance record' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
