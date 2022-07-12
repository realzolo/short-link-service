import express from "express";
import Redis from "./db";
import {convert, hash} from "./util";

const app = express();
const redis = new Redis();

/**
 * Hash the url and store it in the library.
 * @param url The url to hash.
 * @param expired The expiration time in seconds.
 * @returns The hashed url.
 */
app.use("/register/:url/:time", async (req, res) => {
    try {
        const {url, time} = req.params;
        let hashCode = hash(decodeURIComponent(url)).toString();
        const expires = parseInt(time) > 60 * 60 * 24 * 365 * 10 || parseInt(time) < 0 ? 60 * 60 * 24 * 365 * 10 : parseInt(time);
        const value = await redis.getValue(hashCode);
        // A hash conflict has arisen, the url is hashed again by adding "-${key}".
        if (value && value != url) {
            hashCode = hash(`${url}-${hashCode}`).toString();
        }
        hashCode = convert(Number(hashCode));
        const r = await redis.setValue(hashCode, url, expires);
        if (r != "OK") {
            return res.send("error");
        }
        return res.send(hashCode);
    } catch (e) {
        console.error(e);
        return res.send("error");
    }
});

/**
 * Find the corresponding url by key.
 */
app.use("/s/:key", async (req, res) => {
    const {key} = req.params;
    const url = await redis.getValue(key);
    if (!url) {
        return res.end("not found");
    }
    // If the url ends with "-${key}", it means there is a hash conflict, and the real url needs to remove the "-${key}".
    if (url.endsWith("-".concat(key))) {
        return res.redirect(302, url.slice(0, -key.length - 1));
    }
    return res.redirect(302, url);
});

app.use("/", express.static("public"));

app.listen(3000, () => {
    console.log("listening on port 3000");
});

