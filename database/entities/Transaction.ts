import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { Book } from "./Book";

@Entity("transactions")
export class Transaction {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 20 })
    status!: string;

  @ManyToOne(() => Customer, (customer) => customer.transactions, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customer_id" }) // untuk membuat foreignkey
    customer!: Customer;

  @ManyToOne(() => Book, (book) => book.transactions, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "book_id" }) // untuk membuat foreignkey
    book!: Book;

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
