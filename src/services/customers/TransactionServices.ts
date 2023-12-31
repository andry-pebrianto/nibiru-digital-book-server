import { Repository } from "typeorm";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { PostgreDataSource } from "../../../database/data-source";
import { Book } from "../../../database/entities/Book";
import { Customer } from "../../../database/entities/Customer";
import { Transaction } from "../../../database/entities/Transaction";
import handleError from "../../utils/exception/handleError";
import Env from "../../utils/variables/Env";
import NotFoundError from "../../utils/exception/custom/NotFoundError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";

export default new (class BookServices {
  private readonly customerRepository: Repository<Customer> =
    PostgreDataSource.getRepository(Customer);
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);
  private readonly transactionRepository: Repository<Transaction> =
    PostgreDataSource.getRepository(Transaction);

  async createTransaction(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.body;

      const customerSelected = await this.customerRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });
      if (!customerSelected) {
        throw new NotFoundError(
          `Customer with ID ${res.locals.auth.id} not found`,
          "Customer Not Found"
        );
      }

      const bookSelected = await this.bookRepository.findOne({
        where: {
          id: bookId,
        },
      });
      if (!bookSelected) {
        throw new NotFoundError(
          `Book with ID ${res.locals.auth.id} not found`,
          "Book Not Found"
        );
      }

      const transactionId = uuidv4();
      const totalPrice = bookSelected?.price;

      // payload for midtrans
      const payload = {
        transaction_details: {
          order_id: transactionId,
          gross_amount: totalPrice,
        },
        item_details: [
          {
            id: bookSelected.id,
            price: bookSelected.price,
            quantity: 1,
            name: bookSelected.title,
          },
        ],
        customer_details: {
          first_name: customerSelected.fullname,
          email: customerSelected.email,
        },
        callbacks: {
          finish: `/transaction/${transactionId}`,
          error: `/transaction/${transactionId}`,
          pending: `/transaction/${transactionId}`,
        },
      };
      const response = await fetch(
        `${Env.MIDTRANS_APP_URL}/snap/v1/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${btoa(`${Env.MIDTRANS_SERVER_KEY}:`)}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (response.status !== 201) {
        throw new BadRequestError(
          data?.error_messages?.[0] ||
            "Midtrans not return 201 Created, something wrong happened",
          "Create Transaction Failed"
        );
      }

      const transaction = new Transaction();
      transaction.id = transactionId;
      transaction.book = bookSelected;
      transaction.customer = customerSelected;
      transaction.status = "PENDING";
      transaction.total = totalPrice;
      transaction.snap_token = data.token;
      transaction.snap_redirect_url = data.redirect_url;
      await this.transactionRepository.save(transaction);

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Create Transaction Success",
        data: {
          transactionId,
        },
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getDetailTransaction(req: Request, res: Response): Promise<Response> {
    try {
      const transaction = await this.transactionRepository.findOne({
        relations: ["customer", "book"],
        where: {
          id: req.params.transactionId,
        },
      });
      if (!transaction) {
        throw new NotFoundError(
          `Transaction with ID ${res.locals.auth.id} not found`,
          "Transaction Not Found"
        );
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Get Detail Transaction Success",
        data: transaction,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async transactionNotification(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const transaction = await this.transactionRepository.findOne({
        where: {
          id: data.order_id,
        },
      });
      if (!transaction) {
        throw new NotFoundError(
          `Transaction with ID ${res.locals.auth.id} not found`,
          "Transaction Not Found"
        );
      }

      // check signature key midtrans
      const hash = crypto
        .createHash("sha512")
        .update(
          `${data.order_id}${data.status_code}${data.gross_amount}${Env.MIDTRANS_SERVER_KEY}`
        )
        .digest("hex");

      if (data.signature_key !== hash) {
        throw new BadRequestError(
          "Signature key invalid, please try again your action",
          "Invalid Signature Key"
        );
      }
      // check signature key midtrans

      const transactionStatus = data.transaction_status;
      const fraudStatus = data.fraud_status;

      // update transaction tidak perlu await, karena midtrans tidak membutuhkannya
      if (transactionStatus == "capture") {
        if (fraudStatus == "accept") {
          transaction.status = "SUCCESS";
          this.transactionRepository.save(transaction);
        }
      } else if (transactionStatus == "settlement") {
        transaction.status = "SUCCESS";
        this.transactionRepository.save(transaction);
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        transaction.status = "FAILURE";
        this.transactionRepository.save(transaction);
      } else if (transactionStatus == "pending") {
        transaction.status = "PENDING";
        this.transactionRepository.save(transaction);
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Transaction Notification Webhook Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
