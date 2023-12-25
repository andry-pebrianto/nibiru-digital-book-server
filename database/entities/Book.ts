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
import { Genre } from "./Genre";

@Entity("books")
export class Book {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 100 })
    title!: string;

  @Column({ length: 100 })
    author!: string;

  @Column({ type: "text", array: true })
    photos!: string[];

  @Column({ type: "text" })
    synopsis!: string;

  @Column()
    price!: number;

  @Column({ default: true })
    active!: boolean;

  @ManyToOne(() => Admin, (admin) => admin.books, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "admin_id" }) // untuk membuat foreignkey
    admin!: Admin;

  @ManyToOne(() => Genre, (genre) => genre.books, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "genre_id" }) // untuk membuat foreignkey
    genre!: Genre;

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

  @ManyToMany(() => Customer, (customer) => customer.books_who_buyed, { cascade: true })
  @JoinTable({
    name: "collections",
    joinColumn: {
      name: "book_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "customer_id",
      referencedColumnName: "id",
    },
  })
    customers_who_buying!: Customer[];

  @OneToMany(() => Transaction, (transaction) => transaction.book)
    transactions!: Transaction[];

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
