import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { PostgreDataSource } from "../../../database/data-source";
import { Customer } from "../../../database/entities/Customer";
import { Authentication } from "../../../database/entities/Autentication";
import runValidation from "../../utils/validator/runValidation";
import { googleAuthSchema } from "../../utils/validator/schema/authSchema";
import handleError from "../../utils/exception/handleError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";
import Env from "../../utils/variables/Env";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenize/jwt";
import UnauthorizedError from "../../utils/exception/custom/UnauthorizedError";

export default new (class AuthServices {
  private readonly customerRepository: Repository<Customer> =
    PostgreDataSource.getRepository(Customer);
  private readonly authenticationRepository: Repository<Authentication> =
    PostgreDataSource.getRepository(Authentication);

  async googleAuth(req: Request, res: Response): Promise<Response> {
    try {
      runValidation(req, res, googleAuthSchema);

      const client = new OAuth2Client(Env.GOOGLE_CLIENT_ID);
      const response = await client.verifyIdToken({
        idToken: req.body.tokenId,
        audience: Env.GOOGLE_CLIENT_ID,
      });
      const data = response.getPayload();

      if (!data?.email_verified) {
        throw new BadRequestError(
          `Email ${data?.email} not verified by google`,
          "Email Not verified"
        );
      }

      const customerSelected = await this.customerRepository.findOne({
        where: {
          email: data?.email,
        },
      });

      // Jika customer dengan email sudah terdaftar (LOGIN)
      if (customerSelected) {
        const refreshToken = await generateRefreshToken({
          id: customerSelected.id,
        });
        const accessToken = await generateAccessToken({
          id: customerSelected.id,
        });

        // delete previous refresh token
        await this.authenticationRepository.delete({
          owner_id: customerSelected.id,
        });
        // add new refresh token
        const token = new Authentication();
        token.id = uuidv4();
        token.owner_id = customerSelected.id;
        token.token = refreshToken;
        await this.authenticationRepository.save(token);

        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Login Success",
          refreshToken,
          accessToken,
        });
      }

      // Jika customer belum ada (REGISTER)
      const customer = new Customer();
      customer.id = uuidv4();
      customer.fullname = data?.name || "";
      customer.email = data?.email || "";
      customer.google_id = data?.sub || "";
      customer.profile_picture = data?.picture || "";
      await this.customerRepository.save(customer);

      const refreshToken = await generateRefreshToken({
        id: customer.id,
      });
      const accessToken = await generateAccessToken({
        id: customer.id,
      });

      // add new refresh token
      const token = new Authentication();
      token.id = uuidv4();
      token.owner_id = customer.id;
      token.token = refreshToken;
      await this.authenticationRepository.save(token);

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Register Success",
        refreshToken,
        accessToken,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    try {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Token Is Valid",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.params;
      jwt.verify(token, Env.REFRESH_TOKEN_KEY);

      const refreshToken = await this.authenticationRepository.findOne({
        where: {
          token,
        },
      });
      if (!refreshToken) throw new Error();

      const accessToken = await generateAccessToken({
        id: refreshToken.owner_id,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "New Access Token Generated",
        accessToken,
      });
    } catch (error) {
      return handleError(
        res,
        new UnauthorizedError("Refresh Token Invalid", "Access Unauthorized")
      );
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.params;
      await this.authenticationRepository.delete({
        token,
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Logout Success",
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
