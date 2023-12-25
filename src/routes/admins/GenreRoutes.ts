import { Router } from "express";
import GenreControllers from "../../controllers/admins/GenreControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { onlyAdmin } from "../../middlewares/authorization";

const GenreRoutes = Router();
GenreRoutes.post("/", jwtAuth, onlyAdmin, GenreControllers.addGenre);
GenreRoutes.put("/:genreId", jwtAuth, onlyAdmin, GenreControllers.editGenre);
GenreRoutes.delete("/:genreId", jwtAuth, onlyAdmin, GenreControllers.deleteGenre);

export default GenreRoutes;
