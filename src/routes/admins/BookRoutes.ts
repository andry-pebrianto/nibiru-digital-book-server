import { Router } from "express";
import BookControllers from "../../controllers/admins/BookControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { onlyAdmin } from "../../middlewares/authorization";

const BookRoutes = Router();
BookRoutes.post("/", jwtAuth, onlyAdmin, BookControllers.addBook);
BookRoutes.get("/", jwtAuth, onlyAdmin, BookControllers.findAllBook);
BookRoutes.get("/:bookId", jwtAuth, onlyAdmin, BookControllers.findOneBook);
BookRoutes.put("/:bookId", jwtAuth, onlyAdmin, BookControllers.editBook);
BookRoutes.delete("/:bookId", jwtAuth, onlyAdmin, BookControllers.deleteBook);

export default BookRoutes;
