import { ILike, Repository } from "typeorm";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PostgreDataSource } from "../../../database/data-source";
import { Book } from "../../../database/entities/Book";
import { Admin } from "../../../database/entities/Admin";
import { Genre } from "../../../database/entities/Genre";
import handleError from "../../utils/exception/handleError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";

export default new (class BookServices {
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);
  private readonly adminRepository: Repository<Admin> =
    PostgreDataSource.getRepository(Admin);
  private readonly genreRepository: Repository<Genre> =
    PostgreDataSource.getRepository(Genre);

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

      const { title, author, synopsis, photos, price, genre, file_url } = req.body;

      const genreSelected: Genre | null = await this.genreRepository.findOne({
        where: {
          id: genre,
        },
      });

      if (!genreSelected) {
        throw new NotFoundError(
          `Genre with ID ${res.locals.auth.id} not found`,
          "Genre Not Found"
        );
      }

      const book = new Book();
      book.id = uuidv4();
      book.title = title;
      book.author = author;
      book.synopsis = synopsis;
      book.photos = photos;
      book.price = price;
      book.admin = adminSelected;
      book.genre = genreSelected;
      book.file_url = file_url;

      await this.bookRepository.save(book);

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Add Book Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async findAllBook(req: Request, res: Response): Promise<Response> {
    try {
      let page = typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
      page = page > 1 ? page : 1;
      const search = typeof req.query.search === "string" ? req.query.search : "";
      const genre = typeof req.query.genre === "string" ? req.query.genre : "";

      const whereQuery = [
        {
          title: ILike(`%${search}%`),
          genre: {
            title: genre ? genre : ILike(`%%`),
          },
        },
        {
          author: ILike(`%${search}%`),
          genre: {
            title: genre ? genre : ILike(`%%`),
          },
        },
      ];
      const books = await this.bookRepository.find({
        where: whereQuery,
        relations: ["genre"],
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
        data: books,
        total: booksCount,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async findOneBook(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.params;

      if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(bookId)) {
        throw new BadRequestError(
          "The sent ID is not a valid UUID format",
          "UUID Error"
        );
      }

      const book = await this.bookRepository.findOne({
        where: {
          id: bookId,
        },
        relations: ["genre"],
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
        message: "Find Detail Book Success",
        data: book,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async editBook(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.params;

      if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(bookId)) {
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

      const { title, author, synopsis, photos, price, genre, file_url } = req.body;

      const genreSelected: Genre | null = await this.genreRepository.findOne({
        where: {
          id: genre,
        },
      });

      if (!genreSelected) {
        throw new NotFoundError(
          `Genre with ID ${res.locals.auth.id} not found`,
          "Genre Not Found"
        );
      }

      book.title = title;
      book.author = author;
      book.synopsis = synopsis;
      book.photos = photos;
      book.price = price;
      book.genre = genreSelected;
      book.file_url = file_url;

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

  async suspendBookAndOpposites(req: Request, res: Response): Promise<Response> {
    try {
      const { bookId } = req.params;

      if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(bookId)) {
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

      if (book.active) {
        book.active = false;
        await this.bookRepository.save(book);

        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Suspend Book Success",
        });
      }

      book.active = true;
      await this.bookRepository.save(book);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Cancel Suspend Book Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
