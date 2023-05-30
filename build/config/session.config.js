"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_session_handler = void 0;
const prisma_config_1 = require("./prisma.config");
class UserSessionHandler {
    prisma;
    sessionCache;
    defaultExpiration;
    constructor(prisma) {
        this.prisma = prisma;
        this.sessionCache = new Map();
        this.defaultExpiration = 60 * 60 * 24 * 365 * 1000; // one year in ms
    }
    async createSession(userId) {
        const session = await this.prisma.user_session.create({
            data: {
                user_id: userId,
                timeout_date: this.getSessionTimeout(),
            },
        });
        this.sessionCache.set(session.session_id, session);
        return session;
    }
    async getSession(sessionId) {
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
    async updateSessionTimeout(sessionId) {
        const session = await this.prisma.user_session.update({
            where: { session_id: sessionId },
            data: { timeout_date: this.getSessionTimeout() },
        });
        if (session) {
            this.sessionCache.set(sessionId, session);
        }
        return session;
    }
    async deleteSession(sessionId) {
        this.sessionCache.delete(sessionId);
        await this.prisma.user_session.delete({ where: { session_id: sessionId } });
    }
    getSessionTimeout() {
        return new Date(Date.now() + this.defaultExpiration);
    }
    isSessionExpired(session) {
        const currentDateTime = new Date();
        return session.timeout_date < currentDateTime;
    }
}
exports.user_session_handler = new UserSessionHandler(prisma_config_1.prisma);
