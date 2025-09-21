import { Entity, ManyToOne, Property } from "@mikro-orm/mongodb";
import { BaseEntity } from "./BaseEntity.js";
import { Guild } from "discord.js";

@Entity()
export class Group extends BaseEntity {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToOne(() => Guild)
  guild: Guild;

  @Property()
  rolesId: string[];

  constructor(name: string, rolesId: string[], guild: Guild) {
    super();
    this.name = name;
    this.rolesId = rolesId;
    this.guild = guild;
  }
}
