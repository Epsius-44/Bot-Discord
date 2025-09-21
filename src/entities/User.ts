import { Collection, Entity, OneToMany, Property } from "@mikro-orm/mongodb";
import { BaseEntity } from "./BaseEntity.js";
import { Moderation } from "./Moderation.js";

@Entity()
export class User extends BaseEntity {
  @Property()
  userId: string;

  @Property({ nullable: true })
  epsiId?: string;

  @OneToMany(() => Moderation, (moderation) => moderation.user)
  moderations = new Collection<Moderation>(this);

  constructor(userId: string) {
    super();
    this.userId = userId;
  }
}
