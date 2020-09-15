import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getRepository, In } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface CSVTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filepath: string): Promise<Transaction[]> {
    const categoryRepo = getRepository(Category);
    const transactionRepo = getRepository(Transaction);

    const csvFilePath = path.resolve(filepath);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      transactions.push({ title, type, value, category });

      categories.push(category);
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const sameCategories = await categoryRepo.find({
      where: {
        title: In(categories),
      },
    });

    const sameCategoryTitles = sameCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitle = categories
      .filter(category => !sameCategoryTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategory = categoryRepo.create(
      addCategoryTitle.map(title => ({
        title,
      })),
    );

    await categoryRepo.save(newCategory);

    const finalCategories = [...newCategory, ...sameCategories];

    const createdTransactions = transactionRepo.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepo.save(createdTransactions);

    await fs.promises.unlink(filepath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
