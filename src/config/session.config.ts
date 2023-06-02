import { PrismaClient, user_session } from "@prisma/client";
import { prisma } from "./prisma.config";

class UserSessionHandler {
  private sessionCache: Map<string, user_session>;
  private readonly defaultExpiration: number;

  constructor(private prisma: PrismaClient) {
    this.sessionCache = new Map();
    this.defaultExpiration = 60 * 60 * 24 * 365 * 1000; // one year in ms
  }

  async createSession(user_id: string): Promise<user_session> {
    debugger;
    const session = await this.prisma.user_session.create({
      data: {
        user_id: user_id,
        timeout_date: this.getSessionTimeout(),
      },
    });

    this.sessionCache.set(session.session_id, session);

    return session;
  }

  async getSession(sessionId: string): Promise<user_session | null> {
    let session = this.sessionCache.get(sessionId);

    if (!session) {
      let db_session = await this.prisma.user_session.findUnique({
        where: { session_id: sessionId },
      });

      if (db_session && this.isSessionExpired(db_session)) {
        await this.prisma.user_session.delete({
          where: { session_id: sessionId },
        });
        db_session = null;
      }

      if (db_session) {
        this.sessionCache.set(sessionId, db_session);
      }

      return db_session;
    }

    return session || null;
  }

  async updateSessionTimeout(sessionId: string): Promise<user_session | null> {
    const session = await this.prisma.user_session.update({
      where: { session_id: sessionId },
      data: { timeout_date: this.getSessionTimeout() },
    });

    if (session) {
      this.sessionCache.set(sessionId, session);
    }

    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessionCache.delete(sessionId);
    await this.prisma.user_session.delete({ where: { session_id: sessionId } });
  }

  private getSessionTimeout(): Date {
    return new Date(Date.now() + this.defaultExpiration);
  }

  private isSessionExpired(session: user_session): boolean {
    const currentDateTime = new Date();
    return session.timeout_date < currentDateTime;
  }
}

export const user_session_handler = new UserSessionHandler(prisma);
