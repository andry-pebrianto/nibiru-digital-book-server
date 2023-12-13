import { Router } from "express";
import BookControllers from "../../controllers/admins/BookControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";

const BookRoutes = Router();
BookRoutes.post("/add", jwtAuth, BookControllers.addBook);

export default BookRoutes;
