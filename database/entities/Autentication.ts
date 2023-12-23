import {
  Entity,
  Column,
  PrimaryColumn,
} from "typeorm";

@Entity("authentications")
export class Authentication {
  @PrimaryColumn({ type: "uuid" })
    id!: string;

  @Column({ type: "uuid" })
    owner_id!: string;

  @Column({ type: "text" })
    token!: string;
}
