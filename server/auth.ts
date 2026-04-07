import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { User } from "@shared/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-this";
const COOKIE_NAME = "auth_token";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
            isAuthenticated(): boolean;
        }
    }
}

export function setupAuth(app: Express) {
    // Middleware to extract user from JWT
    app.use(async (req, res, next) => {
        req.isAuthenticated = (() => !!req.user) as any;
        const token = req.cookies[COOKIE_NAME];
        if (!token) {
            return next();
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
            const user = await storage.getUser(decoded.id);
            if (user) {
                req.user = user;
            }
        } catch (error) {
            // Invalid token
        }
        next();
    });

    app.post("/api/login", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password } = req.body;
            let user;
            if (username.includes('@')) {
                user = await storage.getUserByEmail(username);
            } else {
                user = await storage.getUserByUsername(username);
            }

            if (!user) {
                return res.status(401).json({ message: "Incorrect username or password." });
            }

            const isMatch = await bcrypt.compare(password, user.password!);
            if (!isMatch && user.password !== password) { // allow plaintext for seeded old users if any, though ideally all should be hashed
                return res.status(401).json({ message: "Incorrect username or password." });
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
            res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    });

    app.post("/api/logout", (req: Request, res: Response) => {
        res.clearCookie(COOKIE_NAME);
        res.sendStatus(200);
    });

    app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const existingUser = await storage.getUserByUsername(req.body.username);
            if (existingUser) {
                return res.status(400).send("Username already exists");
            }
            if (req.body.email) {
                const existingEmail = await storage.getUserByEmail(req.body.email);
                if (existingEmail) {
                    return res.status(400).send("Email already exists");
                }
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = await storage.createUser({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                role: "patient"
            });

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
            res.cookie(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
            
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    });

    app.get("/api/auth/user", (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.json(req.user);
    });
}
