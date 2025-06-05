import { Container, loadBalance } from "@cloudflare/containers";

export class Backend extends Container {
  defaultPort = 8080; // pass requests to port 8080 in the container
  sleepAfter = "2h"; // only sleep a container if it hasn't gotten requests in 2 hours
}

export interface Env {
  BACKEND: DurableObjectNamespace<Backend>;
  ASSETS: Fetcher;
}

const INSTANCE_COUNT = 3;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api")) {
      // note: "loadBalance" to be replaced with latency-aware routing in the near future
      const containerInstance = await loadBalance(env.BACKEND, INSTANCE_COUNT)
      return containerInstance.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};