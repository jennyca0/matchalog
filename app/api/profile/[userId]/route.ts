export async function GET(): Promise<Response> {
  return Response.json({ error: 'Profile API is not implemented' }, { status: 501 });
}
