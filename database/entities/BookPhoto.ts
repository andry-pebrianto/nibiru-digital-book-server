import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Book } from "./Book";

@Entity("book_photos")
export class BookPhoto {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ type: "text" })
    title!: string;

  @ManyToOne(() => Book, (book) => book.photos, {
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
