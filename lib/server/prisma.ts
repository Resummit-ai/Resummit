import 'server-only';

// @ts-ignore (intentional bridge)
import { prisma as db } from './db.js';

export const prisma = db;
