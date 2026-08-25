/** Authenticated principal attached to the request by `authenticate`. */
export interface AuthContext {
  userId: string;
  email: string;
  roleSlug: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export {};
