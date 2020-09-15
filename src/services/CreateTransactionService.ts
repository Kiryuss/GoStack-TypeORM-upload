/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransactionRepository);
    const categoryRepo = getRepository(Category);

    let findEqualTitle = await categoryRepo.findOne({
      where: { title: category },
    });

    if (!findEqualTitle) {
      findEqualTitle = categoryRepo.create({
        title: category,
      });

      await categoryRepo.save(findEqualTitle);
    }

    const balance = (await transactionRepo.getBalance()).total;

    if (type === 'outcome' && value > balance) {
      throw new AppError('You dont have credit for this operation', 400);
    }
    const transaction = transactionRepo.create({
      title,
      type,
      value,
      category: findEqualTitle,
    });

    await transactionRepo.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
