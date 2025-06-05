import { Container } from '@cloudflare/containers';

export class MyContainer extends Container {
  defaultPort = 8080;
  sleepAfter = '10m';
  autoscale = true;
}

export default {
  async fetch(
    request: Request,
    env: { MY_CONTAINER: DurableObjectNamespace<MyContainer> }
  ): Promise<Response> {
    const pathname = new URL(request.url).pathname;

    // To route requests to a specific container,
    // pass a unique container identifier to .get()
    if (pathname.startsWith('/container')) {
      let id = env.MY_CONTAINER.idFromName(pathname);
      let container = env.MY_CONTAINER.get(id, {locationHint: 'enamer'});
      return await container.fetch(request);
    }

    return new Response(
      'Call /container/<ID> to start a container for each ID with a 10s timeout.\nCall /lb to load balancing over multiple containers\nCall /error to start a container that errors\nCall /singleton to get a single specific container'
    );
  },
};