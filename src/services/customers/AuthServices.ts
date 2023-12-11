import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { PostgreDataSource } from "../../../database/data-source";
import { Customer } from "../../../database/entities/Customer";
import runValidation from "../../utils/validator/runValidation";
import { googleAuthSchema } from "../../utils/validator/schema/authSchema";
import handleError from "../../utils/exception/handleError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";
import BadRequestError from "../../utils/exception/custom/BadRequestError";
import Env from "../../utils/variables/Env";

export default class AuthServices {
  private readonly customerRepository: Repository<Customer> =
    PostgreDataSource.getRepository(Customer);

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
        const token = jwt.sign({ id: customerSelected.id }, Env.JWT_SECRET, {
          expiresIn: 604800,
        });

        return res.status(200).json({
          code: 200,
          status: "success",
          message: "Login Success",
          token,
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

      const token = jwt.sign({ id: customer.id }, Env.JWT_SECRET, {
        expiresIn: 604800,
      });

      return res.status(201).json({
        code: 201,
        status: "success",
        message: "Register Success",
        token,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    try {
      const customerSelected: Customer | null =
        await this.customerRepository.findOne({
          where: {
            id: res.locals.auth.id,
          },
        });

      if (!customerSelected) {
        throw new NotFoundError(
          `Customer with ID ${res.locals.auth.id} not found`,
          "Customer Not Found"
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
}
