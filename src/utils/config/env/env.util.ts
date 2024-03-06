import "dotenv/config";
import { envSchema } from "./env.z";


const parser = envSchema.safeParse(process.env);

if (!parser.success) throw Error("Missing environment variable", { cause: parser.error.message });

export const env = parser.data;

export const isDev = process.argv.includes("dev");
export const isProd = !process.argv.includes("dev");

export const isDebug = process.argv.includes("debug");