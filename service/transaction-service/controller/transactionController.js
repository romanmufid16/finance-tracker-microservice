import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addData = async (req, res) => {
  const { userId, amount, type, category, date } = req.body;
  try {
    const response = await prisma.transaction.create({
      data: {
        userId,
        amount,
        type,
        category,
        date
      }
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAll = async (req, res) => {
  const limit = 10;
  const page = parseInt(req.query.page) || 1;

  const offset = (page - 1) * limit;
  try {
    const response = await prisma.transaction.findMany({
      skip: offset,
      take: limit
    });

    const totalData = await prisma.transaction.count();

    res.status(200).json({
      meta: {
        total: totalData,
        page,
        last_page: Math.ceil(totalData / limit)
      },
      data: response
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: id,
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteData = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    await prisma.transaction.delete({
      where: {
        id: id,
      }
    });

    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionByCategory = async (req, res) => {
  const category = req.params.category;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        category: category
      }
    });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateData = async (req, res) => {
  const { userId, amount, type, category, date } = req.body;
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    // Cek apakah transaksi dengan ID tersebut ada
    const transaction = await prisma.transaction.findUnique({
      where: { id: id },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update transaksi
    const response = await prisma.transaction.update({
      where: { id: id },
      data: {
        userId,
        amount,
        type,
        category,
        date: new Date(date), // Pastikan tanggal diformat sebagai Date
      },
    });

    res.status(200).json({
      message: 'Transaction successfully updated',
      data: response,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}