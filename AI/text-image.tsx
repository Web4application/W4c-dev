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
