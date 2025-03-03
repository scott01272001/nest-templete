import { RefreshToken } from "../schemas/refresh-token.schema";

export interface RefreshTokenRepository {
    findByToken(token: string): Promise<RefreshToken | null>;
    create(token: string): Promise<RefreshToken>;
    delete(token: string): Promise<void>;
}