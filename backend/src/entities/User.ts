import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index, ManyToMany } from 'typeorm'
import { Post } from './Post'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  username: string

  @Column('varchar', { length: 1024, comment: 'プロフィール', nullable: true })
  profile: string

  @CreateDateColumn({ comment: 'ユーザ登録日時' })
  readonly registerd_at: Date

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @ManyToMany(() => Post, (post) => post.users)
  likes: Post[];
}
