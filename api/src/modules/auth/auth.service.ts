import { signToken } from '../../lib/jwt';
import { verifyPassword } from '../../lib/password';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/http-error';
import type { LoginInput } from './auth.schema';

/** Shape returned to clients — never leak the password hash. */
function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: { slug: string; name: string; permissions: string[] };
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    role: {
      slug: user.role.slug,
      name: user.role.name,
      permissions: user.role.permissions,
    },
  };
}

export async function login({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    throw new HttpError(401, 'Invalid credentials');
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, 'Invalid credentials');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signToken({ sub: user.id, email: user.email, role: user.role.slug });

  return { token, user: toPublicUser(user) };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });
  if (!user) throw new HttpError(404, 'User not found');
  return toPublicUser(user);
}
