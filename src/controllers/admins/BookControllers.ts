import { Request, Response } from "express";
import BookServices from "../../services/admins/BookServices";

export default new (class BookControllers {
  addBook(req: Request, res: Response) {
    BookServices.addBook(req, res);
  }
})();
