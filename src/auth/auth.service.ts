import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Validator } from 'src/common/validator.class';
import { hash, compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService,
    private readonly JwtService: JwtService) { }

  async register(data: RegisterAuthDto) {
    const hashPass = await hash(data.pas, 10)

    const updatedData = { ...data, pas: hashPass };

    try {
      const response = await this.prisma.users.create({
        data: updatedData
      });

      const { pas, ...newUser } = response;
      return newUser

    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Tthe email already exists')
      }
      throw new InternalServerErrorException()
    }
  }

  async login(data: LoginAuthDto) {
    const { email, pas } = data;

    try {
      const validator = new Validator(this.prisma);
      await validator.existUserThisEmail(email);

      const passHash = await this.prisma.users.findFirst({
        select: {
          pas: true
        },
        where: { email }
      });

      const validationPass = await compare(pas, passHash.pas);
      if (!validationPass) {
        throw new UnauthorizedException('credentials are incorrect')
      }

      const userInfo = await this.prisma.users.findFirst({
        select: {
          id: true,
          email: true,
          username: true,
          role_user: true,
        },
        where: {
          email
        }
      });

      const payload = { userInfo }

      const token = await this.JwtService.sign(payload)

      return {
        message: 'authentic successful',
        token
      }


    } catch (error) {
      console.log(error)

      if (error instanceof NotFoundException) {
        throw error
      }

      if (error instanceof UnauthorizedException) {
        throw error
      }

      throw new InternalServerErrorException

    }

  }

}
