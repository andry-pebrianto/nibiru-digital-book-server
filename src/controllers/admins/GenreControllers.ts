import { Request, Response } from "express";
import GenreServices from "../../services/admins/GenreServices";
import runValidation from "../../utils/validator/runValidation";
import { addGenreSchema } from "../../utils/validator/schema/genreSchema";

export default new (class GenreControllers {
  addGenre(req: Request, res: Response) {
    if (runValidation(req, res, addGenreSchema) === "VALID") {
      GenreServices.addGenre(req, res);
    }
  }
  editGenre(req: Request, res: Response) {
    if (runValidation(req, res, addGenreSchema) === "VALID") {
      GenreServices.editGenre(req, res);
    }
  }
  deleteGenre(req: Request, res: Response) {
    GenreServices.deleteGenre(req, res);
  }
})();
