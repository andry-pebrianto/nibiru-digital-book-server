import { ILike, Repository } from "typeorm";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PostgreDataSource } from "../../../database/data-source";
import { Book } from "../../../database/entities/Book";
import { Admin } from "../../../database/entities/Admin";
import handleError from "../../utils/exception/handleError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";

export default new (class BookServices {
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);
  private readonly adminRepository: Repository<Admin> =
    PostgreDataSource.getRepository(Admin);

  async addBook(req: Request, res: Response): Promise<Response> {
    try {
      const adminSelected: Admin | null = await this.adminRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });

      if (!adminSelected) {
        throw new NotFoundError(
          `Admin with ID ${res.locals.auth.id} not found`,
          "Admin Not Found"
        );
      }

      const { title, author, synopsis, photos, price } = req.body;

      const book = new Book();
      book.id = uuidv4();
      book.title = title;
      book.author = author;
      book.synopsis = synopsis;
      book.photos = photos;
      book.price = price;
      book.admin = adminSelected;

      await this.bookRepository.save(book);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Add Book Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async findAllBook(req: Request, res: Response): Promise<Response> {
    try {
      let page =
        typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
      page = page > 1 ? page : 1;
      const search =
        typeof req.query.search === "string" ? req.query.search : "";

      const books = await this.bookRepository.find({
        where: [
          { title: ILike(`%${search}%`) },
          { author: ILike(`%${search}%`) },
        ],
        take: 20,
        skip: page * 20 - 20,
        order: {
          created_at: "DESC",
        },
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find All Book Success",
        data: books,
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
        data: book,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async editBook(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.params;

      const book: Book | null = await this.bookRepository.findOne({
        where: {
          id: bookId,
        },
      });

      if (!book) {
        throw new NotFoundError(
          `Book with ID ${bookId} not found`,
          "Book Not Found"
        );
      }

      const { title, author, synopsis, photos, price } = req.body;
      book.title = title;
      book.author = author;
      book.synopsis = synopsis;
      book.photos = photos;
      book.price = price;

      await this.bookRepository.save(book);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Update Book Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deleteBook(req: Request, res: Response): Promise<Response> {
    try {
      const book: Book | null = await this.bookRepository.findOne({
        where: {
          id: req.params.bookId,
        },
      });

      if (!book) {
        throw new NotFoundError(
          `Book with ID ${req.params.bookId} not found`,
          "Book Not Found"
        );
      }

      await this.bookRepository.delete(book.id);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Delete Book Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
