// pages/api/calculateTotalPrice.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { ingredientes } = req.body;

    if (!Array.isArray(ingredientes)) {
      return res.status(400).json({ ok: false, message: 'Ingredientes deben ser un arreglo' });
    }

    try {
      const total = ingredientes.reduce((acc, ingrediente) => acc + ingrediente.precioConMerma, 0);
      res.status(200).json({ ok: true, total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Error al calcular el costo total' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
