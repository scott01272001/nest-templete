import { RefreshToken } from "../schemas/refresh-token.schema";

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepository {
    findByToken(token: string): Promise<RefreshToken | null>;
    create(token: string): Promise<RefreshToken>;
    deleteById(id: string): Promise<void>;
    update(id: string, token: string): Promise<RefreshToken>;
}