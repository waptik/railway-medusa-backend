import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils";
import {
  ADMIN_CORS,
  AUTH_CORS,
  BACKEND_URL,
  COOKIE_SECRET,
  DATABASE_URL,
  JWT_SECRET,
  PAYSTACK_API_KEY,
  REDIS_URL,
  SHOULD_DISABLE_ADMIN,
  STORE_CORS,
  WORKER_MODE,
} from "lib/constants";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const medusaConfig = {
  projectConfig: {
    databaseUrl: DATABASE_URL,
    databaseLogging: true,
    redisUrl: REDIS_URL,
    workerMode: WORKER_MODE,
    http: {
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      storeCors: STORE_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    },
  },
  admin: {
    backendUrl: BACKEND_URL,
    disable: SHOULD_DISABLE_ADMIN,
  },
  modules: [
    {
      key: Modules.FILE,
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "static",
              backend_url: `${BACKEND_URL}/static`,
            },
          },
        ],
      },
    },
    ...(REDIS_URL
      ? [{
        key: Modules.CACHE,
        resolve: "@medusajs/medusa/cache-redis",
        options: {
          redisUrl: process.env.REDIS_URL,
        },
      }, {
        key: Modules.EVENT_BUS,
        resolve: "@medusajs/event-bus-redis",
        options: {
          redisUrl: REDIS_URL,
        },
      }, {
        key: Modules.WORKFLOW_ENGINE,
        resolve: "@medusajs/workflow-engine-redis",
        options: {
          redis: {
            url: REDIS_URL,
          },
        },
      }]
      : []),
    ...(PAYSTACK_API_KEY
      ? [{
        key: Modules.PAYMENT,
        resolve: "@medusajs/payment",
        options: {
          providers: [
            {
              resolve: "medusa-payment-paystack",
              options: {
                secret_key: PAYSTACK_API_KEY,
                debug: true,
              } satisfies import("medusa-payment-paystack").PluginOptions,
            },
          ],
        },
      }]
      : []),
  ],
  plugins: [],
};

console.log(JSON.stringify(medusaConfig, null, 2));
export default defineConfig(medusaConfig);
