export { GET } from '../route';
import { handleStashDelete, handleStashPatch } from '@/lib/stash-route-handlers';
import type { RouteContext } from '@/lib/types';

export async function PATCH(request: Request, context: RouteContext<{ userStash: string }>) {
  return handleStashPatch(request, context);
}

export async function DELETE(request: Request, context: RouteContext<{ userStash: string }>) {
  return handleStashDelete(request, context);
}
