import { Request, Response } from "express";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { PostgreDataSource } from "../../../database/data-source";
import { Genre } from "../../../database/entities/Genre";
import { Book } from "../../../database/entities/Book";
import handleError from "../../utils/exception/handleError";
import ConflictError from "../../utils/exception/custom/ConflictError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";

export default new (class GenreServices {
  private readonly genreRepository: Repository<Genre> =
    PostgreDataSource.getRepository(Genre);
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);

  async findAllGenre(req: Request, res: Response): Promise<Response> {
    try {
      const genres = await this.genreRepository.find();

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find All Genre Success",
        data: genres,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async findOneGenre(req: Request, res: Response): Promise<Response> {
    try {
      const { genreId } = req.params;

      if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(genreId)) {
        throw new BadRequestError(
          "The sent ID is not a valid UUID format",
          "UUID Error"
        );
      }

      const genre = await this.genreRepository.findOne({
        where: {
          id: genreId,
        },
      });

      if (!genre) {
        throw new NotFoundError(
          `Genre with ID ${genreId} not found`,
          "Genre Not Found"
        );
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find Detail Genre Success",
        data: genre,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async addGenre(req: Request, res: Response): Promise<Response> {
    try {
      const { title, photo } = req.body;

      const genreCheck = await this.genreRepository
        .createQueryBuilder("genres")
        .where("LOWER(genres.title) = LOWER(:title)", {
          title: title.toLowerCase(),
        })
        .getOne();

      if (genreCheck) {
        throw new ConflictError(
          `Genre ${title}, already exist`,
          "Add Genre Failed"
        );
      }

      const genre = new Genre();
      genre.id = uuidv4();
      genre.title = title;
      genre.photo = photo;

      await this.genreRepository.save(genre);

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Add Genre Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async editGenre(req: Request, res: Response): Promise<Response> {
    try {
      const { genreId } = req.params;
      const { title, photo } = req.body;

      if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(genreId)) {
        throw new BadRequestError(
          "The sent ID is not a valid UUID format",
          "UUID Error"
        );
      }

      const genre: Genre | null = await this.genreRepository.findOne({
        where: {
          id: genreId,
        },
      });

      if (!genre) {
        throw new NotFoundError(
          `Genre with ID ${genreId} not found`,
          "Genre Not Found"
        );
      }

      if (genre.title !== title) {
        const genreCheck = await this.genreRepository
          .createQueryBuilder("genres")
          .where("LOWER(genres.title) = LOWER(:title)", {
            title: title.toLowerCase(),
          })
          .getOne();

        if (genreCheck) {
          throw new ConflictError(
            `Genre ${title}, already exist`,
            "Add Genre Failed"
          );
        }
      }

      genre.title = title;
      genre.photo = photo;
      await this.genreRepository.save(genre);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Edit Genre Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deleteGenre(req: Request, res: Response): Promise<Response> {
    try {
      const { genreId } = req.params;

      if (!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/.test(genreId)) {
        throw new BadRequestError(
          "The sent ID is not a valid UUID format",
          "UUID Error"
        );
      }

      const genre: Genre | null = await this.genreRepository.findOne({
        where: {
          id: genreId,
        },
      });

      if (!genre) {
        throw new NotFoundError(
          `Genre with ID ${genreId} not found`,
          "Genre Not Found"
        );
      }

      const genreUsed = await this.bookRepository
        .createQueryBuilder("books")
        .where("genre_id = :genreId", {
          genreId: genre.id,
        })
        .getOne();

      if (genreUsed) {
        throw new ConflictError(
          `Genre with ID ${genreId} used by some book`,
          "Delete Genre Failed"
        );
      }

      await this.genreRepository.delete(genre.id);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Delete Genre Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
