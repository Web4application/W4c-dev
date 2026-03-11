import { routePartykitRequest, Server } from "partyserver";
  
import type { OutgoingMessage, Position } from "../shared";
import type { Connection, ConnectionContext } from "partyserver";

// This is the state that we'll store on each connection
type ConnectionState = {
  position: Position;
};

export class Globe extends Server {
  onConnect(conn: Connection<ConnectionState>, ctx: ConnectionContext) {
    // Whenever a fresh connection is made, we'll
    // send the entire state to the new connection
    
    // First, let's set up the connection state
    conn.setState({ position: { x: 0, y: 0 } });
    
    // Send current state to new connection
    this.broadcast(JSON.stringify({
      type: "user-joined",
      id: conn.id,
      position: conn.state.position
    }));
  }

  onMessage(message: string, sender: Connection<ConnectionState>) {
    const data = JSON.parse(message) as OutgoingMessage;
    
    if (data.type === "position-update") {
      sender.setState({ position: data.position });
      
      // Broadcast position update to all other connections
      this.broadcast(JSON.stringify({
        type: "position-update",
        id: sender.id,
        position: data.position
      }), [sender.id]);
    }
  }

  onClose(connection: Connection<ConnectionState>) {
    this.broadcast(JSON.stringify({
      type: "user-left",
      id: connection.id
    }));
  }
}

export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ai = new Ai(env.AI);

    const inputs = {
      prompt: "cyberpunk cat"
    };

    try {
      const response = await ai.run(
        '@cf/stabilityai/stable-diffusion-xl-base-1.0',
        inputs
      );

      return new Response(response, {
        headers: {
          'content-type': 'image/png',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }
  },
};
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/hello') {
      return new Response(JSON.stringify({
        message: 'Hello, World!',
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('cf-connecting-ip'),
        country: request.headers.get('cf-ipcountry'),
      }), {
        headers: {
          'content-type': 'application/json',
          'access-control-allow-origin': '*',
        },
      });
    }

    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hello World Worker</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            .api-example { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            pre { background: #333; color: #fff; padding: 15px; border-radius: 4px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🌍 Hello from Cloudflare Workers!</h1>
            <p>This Worker is running on the edge, close to your users.</p>
            
            <div class="api-example">
              <h3>Try the API:</h3>
              <p>GET <code>/api/hello</code></p>
              <pre>curl ${url.origin}/api/hello</pre>
            </div>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'content-type': 'text/html',
      },
    });
  },
};
