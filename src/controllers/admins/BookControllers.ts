import { Request, Response } from "express";
import BookServices from "../../services/admins/BookServices";
import runValidation from "../../utils/validator/runValidation";
import { addBookSchema } from "../../utils/validator/schema/bookSchema";

export default new (class BookControllers {
  addBook(req: Request, res: Response) {
    if (runValidation(req, res, addBookSchema) === "VALID") {
      BookServices.addBook(req, res);
    }
  }
  editBook(req: Request, res: Response) {
    if (runValidation(req, res, addBookSchema) === "VALID") {
      BookServices.editBook(req, res);
    }
  }
  findAllBook(req: Request, res: Response) {
    BookServices.findAllBook(req, res);
  }
  findOneBook(req: Request, res: Response) {
    BookServices.findOneBook(req, res);
  }
  deleteBook(req: Request, res: Response) {
    BookServices.deleteBook(req, res);
  }
})();
