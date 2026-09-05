export async function GET(): Promise<Response> {
  return Response.json({ error: 'Recipe API is not implemented' }, { status: 501 });
}
