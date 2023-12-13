import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Admin } from "./Admin";
import { Customer } from "./Customer";
import { Transaction } from "./Transaction";
import { BookPhoto } from "./BookPhoto";

@Entity("books")
export class Book {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 100 })
    title!: string;

  @Column({ length: 100 })
    author!: string;

  @Column({ type: "text" })
    cover_picture!: string;

  @Column({ length: 1000 })
    synopsis!: string;

  @Column()
    price!: number;

  @ManyToOne(() => Admin, (admin) => admin.books, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "admin_id" }) // untuk membuat foreignkey
    admin!: Admin;

  @ManyToMany(() => Customer, (customer) => customer.books_who_saved, { cascade: true })
  @JoinTable({
    name: "carts",
    joinColumn: {
      name: "book_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "customer_id",
      referencedColumnName: "id",
    },
  })
    customers_who_saving!: Customer[];

  @OneToMany(() => BookPhoto, (book_photo) => book_photo.book)
    photos!: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.book)
    transactions!: Transaction[];

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
