import { ILike, Repository } from "typeorm";
import { Request, Response } from "express";
import { PostgreDataSource } from "../../../database/data-source";
import { Book } from "../../../database/entities/Book";
import handleError from "../../utils/exception/handleError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";

export default new (class BookServices {
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);

  async findAllBook(req: Request, res: Response): Promise<Response> {
    try {
      let page =
        typeof req.query.page === "string" ? parseInt(req.query.page, 10) : 1;
      page = page > 1 ? page : 1;
      const search =
        typeof req.query.search === "string" ? req.query.search : "";

      const books = await this.bookRepository.find({
        relations: ["customers_who_saving", "customers_who_buying"],
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
})();
