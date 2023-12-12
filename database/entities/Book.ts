import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Admin } from "./Admin";

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

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
