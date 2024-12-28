import { NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

export class Validator {

    constructor(private readonly prisma: PrismaService) { }

    async existThisId(id: number, nameModule: string) {
        const itemFound = await this.prisma[nameModule].findFirst({
            where: { id },
        });

        if (!itemFound) {
            throw new NotFoundException(`El recurso con ID ${id} no fue encontrado`);
        }
    }

    async existUserThisEmail(email: string) {
        const itemFound = await this.prisma.users.findFirst({
            where: {
                email
            }
        });

        if (!itemFound) {
            throw new NotFoundException(`Email not found`)
        }
    }
}