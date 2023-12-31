import { NextFunction, Request, Response } from "express";
import { Repository } from "typeorm";
import handleError from "../utils/exception/handleError";
import ForbiddenError from "../utils/exception/custom/ForbiddenError";
import { Admin } from "../../database/entities/Admin";
import { PostgreDataSource } from "../../database/data-source";
import { Customer } from "../../database/entities/Customer";
import { Transaction } from "../../database/entities/Transaction";

export async function onlyAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const adminRepository: Repository<Admin> =
      PostgreDataSource.getRepository(Admin);

    const adminSelected: Admin | null = await adminRepository.findOne({
      where: {
        id: res.locals.auth.id,
      },
    });

    if (!adminSelected) {
      throw new Error();
    }

    next();
  } catch (error) {
    return handleError(
      res,
      new ForbiddenError(
        "You don't have access to these resources (Only Admin)",
        "Access Forbidden"
      )
    );
  }
}

export async function onlyCustomer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const customerRepository: Repository<Customer> =
      PostgreDataSource.getRepository(Customer);

    const customerSelected: Customer | null = await customerRepository.findOne({
      where: {
        id: res.locals.auth.id,
      },
    });

    if (!customerSelected) {
      throw new Error();
    }

    next();
  } catch (error) {
    return handleError(
      res,
      new ForbiddenError(
        "You don't have access to these resources (Only Customer)",
        "Access Forbidden"
      )
    );
  }
}

export async function transactionOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const transactionRepository: Repository<Transaction> =
      PostgreDataSource.getRepository(Transaction);

    const transactionSelected: Transaction | null =
      await transactionRepository.findOne({
        relations: ["customer"],
        where: {
          id: req.params.transactionId,
        },
      });

    if (!transactionSelected) {
      throw new Error("Transaction Not Found");
    }

    if (transactionSelected?.customer.id !== res.locals.auth.id) {
      throw new Error();
    }

    next();
  } catch (error) {
    console.log(error);
    return handleError(
      res,
      new ForbiddenError(
        "You don't have access to these resources (Only Customer Owner)",
        "Access Forbidden"
      )
    );
  }
}
