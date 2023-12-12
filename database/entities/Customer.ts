import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { Book } from "./Book";

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

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
