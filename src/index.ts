import { ExecutionContext } from "@cloudflare/workers-types";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {}

class RequestException extends Error {
  constructor(
    reason: string,
    public statusCode: number,
    public statusText: string
  ) {
    super(reason);
    this.name = statusText;
  }
}

async function handleRequest(request: Request, env: Env) {
  const url = new URL(request.url);
  const { pathname } = url;

  switch (pathname) {
    case "/update":
    case "/nic/update": {
      return new Response("good", {
        status: 200,
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          "Cache-Control": "no-store",
        },
      });
    }

    case "/favicon.ico":
    case "/robots.txt":
      return new Response(null, { status: 204 });
  }

  return new Response("Not Found.", { status: 404 });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return handleRequest(request, env).catch((error: RequestException) => {
      console.error(error);
      const message = error.message ?? error.stack ?? "Unknown Error";

      return new Response(message, {
        status: error.statusCode || 500,
        statusText: error.statusText,
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
          "Cache-Control": "no-store",
          "Content-Length": message.length.toString(),
        },
      });
    });
  },
};
