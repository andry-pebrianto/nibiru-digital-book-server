import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Book } from "./Book";
import { Transaction } from "./Transaction";

@Entity("customers")
export class Customer {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 100 })
    fullname!: string;

  @Column({ length: 50 })
    email!: string;

  @Column({ type: "text", nullable: true })
    google_id!: string;

  @Column({ type: "text" })
    profile_picture!: string;

  @ManyToMany(() => Book, (book) => book.customers_who_saving)
    books_who_saved!: Book[];

  @ManyToMany(() => Book, (book) => book.customers_who_buying)
    books_who_buyed!: Book[];

  @OneToMany(() => Transaction, (transaction) => transaction.customer)
    transactions!: Transaction[];

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
