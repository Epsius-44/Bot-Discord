// @ts-ignore
import * as ha_redis from '@luzilab.epsinyx/ha-redis';
import {Client, ActivityType} from "discord.js";

const packageInfo = require('../../package.json');

const delay = ms => new Promise(res => setTimeout(res, ms));

function dateToString(date: Date) :string {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export class ActiveHa {
    private client: Client;
    private isMaster: boolean = false;

    constructor(client: Client<boolean>) {
        this.client = client;
    }

    async start(): Promise<void> {
        if (!ha_redis.isConnected(process.env.LZLHA_REDIS_URI)) throw new Error("Redis is not connected");
        ha_redis.setInstanceData(
            process.env.LZLHA_REDIS_URI,
            process.env.LZLHA_INSTANCE_ID,
            process.env.LZLHA_INSTANCE_NAME,
            packageInfo.version,
            process.version
        );
        while (1 > 0) {
            let isMaster = ha_redis.lookup(process.env.LZLHA_REDIS_URI, process.env.LZLHA_INSTANCE_ID);
            if (isMaster !== this.isMaster) {
                if (isMaster) {
                    this.client.user.setActivity({
                        name: `${packageInfo.version} - ${process.env.LZLHA_INSTANCE_NAME}`,
                        type: ActivityType.Custom
                    });
                    this.client.log.info("Je suis le master");
                    this.isMaster = isMaster;
                } else {
                    this.client.log.info("Je suis le backup");
                    this.isMaster = isMaster;
                }
            }
            await delay(60000);
        }
    }
}
