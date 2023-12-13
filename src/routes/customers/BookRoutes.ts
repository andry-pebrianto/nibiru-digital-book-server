import { Router } from "express";
import BookControllers from "../../controllers/customers/BookControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { onlyCustomer } from "../../middlewares/authorization";

const BookRoutes = Router();
BookRoutes.get("/", jwtAuth, onlyCustomer, BookControllers.findAllBook);
BookRoutes.get("/:bookId", jwtAuth, onlyCustomer, BookControllers.findOneBook);

export default BookRoutes;
