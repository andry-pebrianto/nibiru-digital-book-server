import { Repository } from "typeorm";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { PostgreDataSource } from "../../../database/data-source";
import { Admin } from "../../../database/entities/Admin";
import { Authentication } from "../../../database/entities/Autentication";
import handleError from "../../utils/exception/handleError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenize/jwt";

export default new (class AuthServices {
  private readonly adminRepository: Repository<Admin> =
    PostgreDataSource.getRepository(Admin);
  private readonly authenticationRepository: Repository<Authentication> =
    PostgreDataSource.getRepository(Authentication);

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

      const refreshToken = await generateRefreshToken({
        id: adminSelected.id,
      });
      const accessToken = await generateAccessToken({
        id: adminSelected.id,
      });

      // delete previous refresh token
      await this.authenticationRepository.delete({
        owner_id: adminSelected.id,
      });
      // add new refresh token
      const token = new Authentication();
      token.id = uuidv4();
      token.owner_id = adminSelected.id;
      token.token = refreshToken;
      await this.authenticationRepository.save(token);

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Login Success",
        refreshToken,
        accessToken,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
