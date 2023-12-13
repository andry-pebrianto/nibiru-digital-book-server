import { Repository } from "typeorm";
import { Request, Response } from "express";
import { PostgreDataSource } from "../../../database/data-source";
import { Book } from "../../../database/entities/Book";
import handleError from "../../utils/exception/handleError";

export default new (class BookServices {
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);

  async addBook(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Add Book Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
