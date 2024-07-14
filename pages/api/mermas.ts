import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const mermas = await prisma.merma.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.status(200).json({ ok: true, mermas });
  } catch (error) {
    console.error('Error fetching mermas:', error);
    res.status(500).json({ ok: false, message: 'Error fetching mermas' });
  }
};

export default handler;
