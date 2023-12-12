import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Book } from "./Book";

@Entity("admins")
export class Admin {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ length: 100 })
    fullname!: string;

  @Column({ length: 50 })
    email!: string;

  @Column({ type: "text" })
    password!: string;

  @OneToMany(() => Book, (book) => book.admin)
    books!: Book[];

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
