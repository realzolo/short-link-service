import {createClient} from "redis";
import config from "./config";

class Redis {
    private redisUrl: string = process.env.REDIS_URL || config.REDIS_URL;
    private client: any;

    constructor() {
        this.client = createClient({url: this.redisUrl});
        this.client.on("error", (err: Error) => {
            console.error("Redis connection error:", err);
        });
        this.client.connect();
    }

    public setValue = async (key: string, url: string, expire: number) => {
        return await this.client.setEx(key, expire, url);
    }

    public getValue = async (key: string) => {
        return await this.client.get(key);
    }
}

export default Redis;