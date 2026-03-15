import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

export interface TokenPayload {
    userId: string;
    email?: string;
    phone?: string;
    role?: string;
}

export const signToken = (payload: TokenPayload, expiresIn: string = '2h'): string => {
    return jwt.sign(payload as object, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch {
        return null;
    }
};
