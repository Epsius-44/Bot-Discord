/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ActivityType, Client } from 'discord.js'
import packageInfo from '../../package.json' assert { type: 'json' }
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

const ha_redis = require('@luzilab.epsinyx/ha-redis')

export interface InstanceInfo {
    id: string
    name: string
    botVersion: string
    nodeVersion: string
    isOnline: boolean
    isMaster: boolean
}
/**
 * Représentation du module de haute disponibilité (écrit en Rust)
 */
export class ActiveHA {
    private client: Client
    private isMaster: boolean = false
    private redisURI: string
    public instanceId: string
    public instanceName: string
    public instanceVersion: string
    public nodeVersion: string

    constructor(
        client: Client,
        redisURI: string,
        instanceId: string,
        instanceName: string
    ) {
        this.client = client
        this.redisURI = redisURI
        this.instanceId = instanceId
        this.instanceName = instanceName
        this.instanceVersion = packageInfo.version
        this.nodeVersion = process.version
    }

    async start(): Promise<void> {
        if (!ha_redis.isConnected(this.redisURI))
            throw new Error('Redis connection failed')
        ha_redis.setInstanceData(
            this.redisURI,
            this.instanceId,
            this.instanceName,
            this.instanceVersion,
            this.nodeVersion
        )
        for (;;) {
            const isMaster = ha_redis.lookup(this.redisURI, this.instanceId)
            if (isMaster !== this.isMaster) {
                if (isMaster) {
                    this.client.user?.setActivity({
                        name: `${this.instanceVersion} - ${this.instanceName}`,
                        type: ActivityType.Custom
                    })
                    this.isMaster = true
                } else {
                    this.isMaster = isMaster
                }
            }
            await delay(60000)
        }
    }

    isConnected(): boolean {
        const connection: boolean = ha_redis.isConnected(this.redisURI)
        return connection
    }

    getClusterInfo(): InstanceInfo[] {
        const clusterInfo: InstanceInfo[] = ha_redis.getClusterInfo(
            this.redisURI
        )
        return clusterInfo
    }
}
