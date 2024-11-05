import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name!: string;

  @Column()
  score!: number;

  @Column()
  email!: string;

  @Column()
  description!: string;

  @Column()
  @Index()
  city!: string;
}
