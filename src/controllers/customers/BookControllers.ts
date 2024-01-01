import { Request, Response } from "express";
import BookServices from "../../services/customers/BookServices";

export default new (class BookControllers {
  findAllBook(req: Request, res: Response) {
    BookServices.findAllBook(req, res);
  }
  findOneBook(req: Request, res: Response) {
    BookServices.findOneBook(req, res);
  }
  findNewBook(req: Request, res: Response) {
    BookServices.findNewBook(req, res);
  }
  addToCartAndOpposite(req: Request, res: Response) {
    BookServices.addToCartAndOpposite(req, res);
  }
  findMyBookCollection(req: Request, res: Response) {
    BookServices.findMyBookCollection(req, res);
  }
})();
