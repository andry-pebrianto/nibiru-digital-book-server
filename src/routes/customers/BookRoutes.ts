import { Router } from "express";
import BookControllers from "../../controllers/customers/BookControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { onlyCustomer } from "../../middlewares/authorization";

const BookRoutes = Router();
BookRoutes.get("/", jwtAuth, onlyCustomer, BookControllers.findAllBook);
BookRoutes.get("/new", BookControllers.findNewBook);
BookRoutes.get("/collection", jwtAuth, onlyCustomer, BookControllers.findMyBookCollection);
BookRoutes.get("/:bookId", jwtAuth, onlyCustomer, BookControllers.findOneBook);
BookRoutes.post("/:bookId/cart", jwtAuth, onlyCustomer, BookControllers.addToCartAndOpposite);

export default BookRoutes;
