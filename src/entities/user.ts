import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from './session';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @Column({ nullable: false, unique: false })
  password: string;

  @Column({ nullable: false, unique: false })
  email: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  public verifiedAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}

export interface UserMinimal {
  id: number;
  email: string;
  updatedAt: Date;
  createdAt: Date;
}
