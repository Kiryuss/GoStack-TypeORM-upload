import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepo = getCustomRepository(TransactionRepository);

    const findTransaction = await transactionRepo.findOne(id);

    if (!findTransaction) {
      throw new AppError('Transaction does not exist');
    }
    await transactionRepo.remove(findTransaction);
  }
}

export default DeleteTransactionService;
