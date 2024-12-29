import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';


@Injectable()
export class RolesGuard implements CanActivate {
  //   ** ¡¡el REFLECTOR permite leer los datos alamcenados en los metaData !!** 
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const roles: string[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!roles) { // Sino se detectan roles puede pasar sin problema
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const { rol } = user?.userInfo?.role_user;

    // Verifica si el rol del usuario está incluido en los roles permitidos
    return roles.some((rolRequerid) => rol.includes(rolRequerid))
  }
}
