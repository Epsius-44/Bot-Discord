import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/mongodb";
import { BaseEntity } from "./BaseEntity.js";
import { Guild } from "discord.js";
import { User } from "./User.js";

@Entity()
export class Moderation extends BaseEntity {
  @ManyToOne(() => Guild)
  guild: Guild;

  @Enum(() => SanctionType)
  sanctionType: SanctionType;

  @Property()
  expiresAt: Date;

  @Property({ nullable: true })
  reason?: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  moderator: User;

  constructor(
    guild: Guild,
    sanctionType: SanctionType,
    duration: number,
    user: User,
    moderator: User,
    reason?: string
  ) {
    super();
    this.guild = guild;
    this.sanctionType = sanctionType;
    this.expiresAt = new Date(Date.now() + duration * 60 * 1000); // duration in minutes
    this.user = user;
    this.moderator = moderator;
    this.reason = reason;
  }
}

export enum SanctionType {
  WARN = "warn",
  MUTE = "mute",
  KICK = "kick",
  BAN = "ban"
}
