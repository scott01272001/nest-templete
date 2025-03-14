import { RefreshTokenDocument } from "../schemas/refresh-token.schema";
import { InjectModel } from "@nestjs/mongoose";
import { RefreshToken } from "../schemas/refresh-token.schema";
import { Model } from "mongoose";
import { RefreshTokenRepository } from "./refresh-token.repository.interface";

export class RefreshTokenMongodbRepository {
    constructor(
        @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>
    ) { }

    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
        const createdRefreshToken = new this.refreshTokenModel({
            ...refreshToken
        });
        return createdRefreshToken.save();
    }

    async findByToken(token: string): Promise<RefreshToken | null> {
        return this.refreshTokenModel.findOne({ refreshToken: token });
    }

    async deleteById(id: string): Promise<void> {
        await this.refreshTokenModel.deleteOne({ _id: id });
    }

}

