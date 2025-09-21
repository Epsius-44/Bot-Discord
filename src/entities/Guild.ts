import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property
} from "@mikro-orm/mongodb";
import { BaseEntity } from "./BaseEntity.js";
import { Group } from "./Group.js";

@Entity()
export class Guild extends BaseEntity {
  @Property()
  discordId: string;

  @Property({ nullable: true })
  archivesCategoryId?: string;

  @Property({ nullable: true })
  tmpChannelsCategoryId?: string;

  @Property({ nullable: true })
  moderationLogChannelId?: string;

  @Property({ nullable: true })
  moderationRoleId?: string;

  @Property({ nullable: true })
  adminRoleId?: string;

  @Property({ nullable: true })
  teacherRoleId?: string;

  @OneToMany(() => Group, (group) => group.guild, { cascade: [Cascade.ALL] })
  groups = new Collection<Group>(this);

  constructor(discordId: string) {
    super();
    this.discordId = discordId;
  }
}
