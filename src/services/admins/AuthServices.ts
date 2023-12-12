import { Repository } from "typeorm";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PostgreDataSource } from "../../../database/data-source";
import { Admin } from "../../../database/entities/Admin";
import handleError from "../../utils/exception/handleError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";
import Env from "../../utils/variables/Env";
import NotFoundError from "../../utils/exception/custom/NotFoundError";

export default new (class AuthServices {
  private readonly adminRepository: Repository<Admin> =
    PostgreDataSource.getRepository(Admin);

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // CHECK EMAIL
      const adminSelected = await this.adminRepository.findOne({
        where: {
          email,
        },
      });

      if (!adminSelected) {
        throw new BadRequestError(`Email or Password wrong`, "Login Failed");
      }
      // CHECK EMAIL

      // CHECK PASSWORD
      const isPasswordValid = await bcrypt.compare(
        password,
        adminSelected.password
      );

      if (!isPasswordValid) {
        throw new BadRequestError(`Email or Password wrong`, "Login Failed");
      }
      // CHECK PASSWORD

      const token = jwt.sign({ id: adminSelected.id }, Env.JWT_SECRET, {
        expiresIn: 604800,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Login Success",
        token,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async check(req: Request, res: Response) {
    try {
      const adminSelected: Admin | null = await this.adminRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });

      if (!adminSelected) {
        throw new NotFoundError(
          `Admin with ID ${res.locals.auth.id} not found`,
          "Admin Not Found"
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
