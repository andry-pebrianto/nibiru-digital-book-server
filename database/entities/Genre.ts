import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Book } from "./Book";

@Entity("genres")
export class Genre {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 50 })
    title!: string;

  @OneToMany(() => Book, (book) => book.genre)
    books!: Book[];

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
