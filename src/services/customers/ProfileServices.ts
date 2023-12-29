import { Request, Response } from "express";
import { Repository } from "typeorm";

import { PostgreDataSource } from "../../../database/data-source";
import { Customer } from "../../../database/entities/Customer";
import { Book } from "../../../database/entities/Book";
import handleError from "../../utils/exception/handleError";
import NotFoundError from "../../utils/exception/custom/NotFoundError";

export default new (class ProfileServices {
  private readonly customerRepository: Repository<Customer> =
    PostgreDataSource.getRepository(Customer);
  private readonly bookRepository: Repository<Book> =
    PostgreDataSource.getRepository(Book);

  async findOneByJwt(req: Request, res: Response): Promise<Response> {
    try {
      const customer: Customer | null = await this.customerRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });

      if (!customer) {
        throw new NotFoundError(
          `Customer with ID ${res.locals.auth.id} not found`,
          "Customer Not Found"
        );
      }

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find One Customer By Jwt Success",
        data: customer,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async myCart(req: Request, res: Response): Promise<Response> {
    try {
      const customer: Customer | null = await this.customerRepository.findOne({
        where: {
          id: res.locals.auth.id,
        },
      });

      if (!customer) {
        throw new NotFoundError(
          `Customer with ID ${res.locals.auth.id} not found`,
          "Customer Not Found"
        );
      }

      const bookOnCarts = await this.bookRepository.find({
        where: {
          customers_who_saving: {
            id: res.locals.auth.id,
          },
        },
      });

      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Find My Cart Success",
        data: bookOnCarts,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }
})();
