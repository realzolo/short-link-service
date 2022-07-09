import {createClient} from "redis";
import config from "./config";

class Redis {
    private client: any;

    constructor() {
        this.client = createClient({url: config.REDIS_URL});
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