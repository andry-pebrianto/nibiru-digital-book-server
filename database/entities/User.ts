import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
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

  @Column({ length: 250, nullable: true })
    bio!: string;

  @Column({ default: 2 })
    role!: boolean;

  @CreateDateColumn({ type: "timestamp with time zone" })
    created_at!: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
    updated_at!: Date;
}
