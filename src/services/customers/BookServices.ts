import { ILike, Repository } from "typeorm";
import { Request, Response } from "express";
import { PostgreDataSource } from "../../../database/data-source";
import { Book } from "../../../database/entities/Book";
import { Customer } from "../../../database/entities/Customer";
import handleError from "../../utils/exception/handleError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";

export default new (class BookServices {
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);
  private readonly customerRepository: Repository<Customer> =
    PostgreDataSource.getRepository(Customer);

  async findAllBook(req: Request, res: Response): Promise<Response> {
    try {
      let page =
        typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
      page = page > 1 ? page : 1;
      const search =
        typeof req.query.search === "string" ? req.query.search : "";
      const genre = typeof req.query.genre === "string" ? req.query.genre : "";

      const whereQuery = [
        {
          title: ILike(`%${search}%`),
          genre: {
            title: genre ? genre : ILike(`%%`),
          },
          active: true,
        },
        {
          author: ILike(`%${search}%`),
          genre: {
            title: genre ? genre : ILike(`%%`),
          },
          active: true,
        },
      ];
      const books = await this.bookRepository.find({
        where: whereQuery,
        relations: ["genre", "customers_who_saving", "customers_who_buying"],
        take: 10,
        skip: page * 10 - 10,
        order: {
          created_at: "DESC",
        },
      });
      const booksCount = await this.bookRepository.count({
        where: whereQuery,
        relations: ["genre"],
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find All Book Success",
        data: books.map((book) => ({
          ...book,
          saved: book.customers_who_saving
            .map((customer) => customer.id)
            .includes(res.locals.auth.id),
          buyed: book.customers_who_buying
            .map((customer) => customer.id)
            .includes(res.locals.auth.id),
          customers_who_saving: null,
          customers_who_buying: null,
        })),
        total: booksCount,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async findOneBook(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.params;

      if (
        !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(
          bookId
        )
      ) {
        throw new BadRequestError(
          "The sent ID is not a valid UUID format",
          "UUID Error"
        );
      }

      const book: Book | null = await this.bookRepository.findOne({
        where: {
          id: bookId,
        },
        relations: ["genre", "customers_who_saving", "customers_who_buying"],
      });

      if (!book) {
        throw new NotFoundError(
          `Book with ID ${bookId} not found`,
          "Book Not Found"
        );
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find One Book Success",
        data: {
          ...book,
          saved: book.customers_who_saving
            .map((customer) => customer.id)
            .includes(res.locals.auth.id),
          buyed: book.customers_who_buying
            .map((customer) => customer.id)
            .includes(res.locals.auth.id),
          customers_who_saving: null,
          customers_who_buying: null,
        },
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async findNewBook(req: Request, res: Response): Promise<Response> {
    try {
      const books = await this.bookRepository.find({
        where: {
          active: true,
        },
        take: 10,
        order: {
          created_at: "DESC",
        },
        relations: ["genre"],
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find New Book Success",
        data: books,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async addToCartAndOpposite(req: Request, res: Response): Promise<Response> {
    try {
      const customerSelected: Customer | null =
        await this.customerRepository.findOne({
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

      const { bookId } = req.params;
      if (
        !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(
          bookId
        )
      ) {
        throw new BadRequestError(
          "The sent ID is not a valid UUID format",
          "UUID Error"
        );
      }

      const bookSelected: Book | null = await this.bookRepository.findOne({
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

      const checkCart = await this.bookRepository.query(
        "SELECT * FROM carts WHERE customer_id=$1 AND book_id=$2",
        [customerSelected.id, bookSelected.id]
      );

      if (checkCart.length) {
        await this.bookRepository.query(
          "DELETE FROM carts WHERE customer_id=$1 AND book_id=$2",
          [customerSelected.id, bookSelected.id]
        );

        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Book Deleted From Cart",
        });
      }

      await this.bookRepository.query(
        "INSERT INTO carts(customer_id, book_id) VALUES($1, $2)",
        [customerSelected.id, bookSelected.id]
      );

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Book Added To Cart",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async findMyBookCollection(req: Request, res: Response): Promise<Response> {
    try {
      const bookCollection = await this.bookRepository.find({
        where: {
          customers_who_buying: {
            id: res.locals.auth.id,
          },
        },
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find My Book Collection Success",
        data: bookCollection,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
