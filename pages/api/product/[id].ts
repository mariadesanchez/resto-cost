import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id as string,
      },
    });

    if (product) {
      res.status(200).json({ ok: true, product });
    } else {
      res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ ok: false, message: 'Error fetching product' });
  }
};

export default handler;
