import { Router } from "express";
import BookControllers from "../../controllers/admins/BookControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";

const BookRoutes = Router();
BookRoutes.post("/", jwtAuth, BookControllers.addBook);
BookRoutes.put("/:id", jwtAuth, BookControllers.editBook);

export default BookRoutes;
