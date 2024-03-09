import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { contractName } = req.query;

  if (!contractName) {
    return res.status(400).json({ error: 'Contract name is required' });
  }

  try {
    const filePath = path.join(process.cwd(), 'out', contractName, `${contractName}.json`);
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.status(200).json({ abi: jsonData.abi, bytecode: jsonData.bytecode.object });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read contract file' });
  }
}
