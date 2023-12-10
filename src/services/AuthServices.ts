import { Repository } from "typeorm";
import { Request, Response } from "express";
import { PostgreDataSource } from "../../database/data-source";
import { User } from "../../database/entities/User";
import handleError from "../utils/exception/handleError";
import NotFoundError from "../utils/exception/custom/NotFoundError";

export default new (class AuthServices {
  private readonly UserRepository: Repository<User> =
    PostgreDataSource.getRepository(User);

  async googleAuth(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Login Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async check(req: Request, res: Response) {
    try {
      const userSelected: User | null = await this.UserRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });

      if (!userSelected) {
        throw new NotFoundError(
          `User with ID ${res.locals.auth.id} not found`,
          "User Not Found"
        );
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Token Is Valid",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
