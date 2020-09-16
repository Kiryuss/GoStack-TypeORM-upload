# GoStack-TypeORM-upload
CRUD and update.


This is a simple project about transactions, there are two types, income and outcome. of course the user cant make an outcome transaction without a valid balance.
Every transaction has an id(uuidv4), title, type, value, and a category. All the data come from a body request in json format, categories has their own table in db,
categories with the same title will have the same id.
And the main feature here, is the possibility to import transactions from csv files.

Tech informations

if you want to get a better look, you will need to follow this steps:

1 - make a postgres db in docker on port 5432.

2 - Install DBeaver, make a connection on postgres, then create a db with this name "gostack_desafio06".

3 - And finaly insomnia, we will have 4 routes here:
 * POST http://localhost:3333/transactions to create transactions, put this in json body : "title": "YourTitle", "value": 0000, "type": "income | outcome", "category": "YourCategory"
 * GET http://localhost:3333/transactions list all transactions
 * DELETE http://localhost:3333/transactions/id to delete a transaction
 * POST http://localhost:3333/transactions/import 

dont forget to run yarn before everything.
