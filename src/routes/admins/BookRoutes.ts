import { Router } from "express";
import BookControllers from "../../controllers/admins/BookControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { onlyAdmin } from "../../middlewares/authorization";

const BookRoutes = Router();
BookRoutes.post("/", jwtAuth, onlyAdmin, BookControllers.addBook);
BookRoutes.put("/:id", jwtAuth, onlyAdmin, BookControllers.editBook);

export default BookRoutes;
