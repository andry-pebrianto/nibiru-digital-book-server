import { Repository } from "typeorm";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { PostgreDataSource } from "../../../database/data-source";
import { Book } from "../../../database/entities/Book";
import { Admin } from "../../../database/entities/Admin";
import handleError from "../../utils/exception/handleError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";

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
})();
