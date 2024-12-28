import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Validator } from '../common/validator.class';
import { Request } from 'express';

/**
 * Servicio para manejar la lógica de negocio relacionada con los posts.
 * Proporciona métodos para crear, leer, actualizar y eliminar posts.
 */
@Injectable()
export class PostsService {

  /**
  * Inyecta el servicio Prisma para interactuar con la base de datos.
  * @param prisma - Servicio Prisma para consultas a la base de datos.
  */
  constructor(private prisma: PrismaService) { }

  /**
   * Crea un nuevo post en la base de datos.
   * @param data - DTO que contiene los datos necesarios para crear el post.
   * @returns El post creado.
   * @throws InternalServerErrorException - Si ocurre un error durante la creación.
   */
  async create(data: CreatePostDto) {

    try {
      return await this.prisma.posts.create({
        data
      });

    } catch (error) {
      return new InternalServerErrorException()
    }
  }

  /**
   * Recupera todos los posts de la base de datos.
   * @returns Una lista de posts.
   * @throws InternalServerErrorException - Si ocurre un error al obtener los posts.
   */
  async findAll(req: Request) {
    const { } = req.user; // propiedades del request/user
    try {
      return await this.prisma.posts.findMany({
        include: {
          author: { // El campo que relacionado que se deseaa ver
            select: { // Las comlumnas que se desean ver de ese campo de relacion
              id: true,
              email: true,
              username: true,
              role_id: true,
            }
          }
        }
      });

    } catch (error) {
      return new InternalServerErrorException();

    }
  }


  /**
   * Recupera un post específico por su ID.
   * @param id - ID del post a recuperar.
   * @returns El post encontrado.
   * @throws NotFoundException - Si no se encuentra el post.
   * @throws InternalServerErrorException - Si ocurre un error inesperado.
   */
  async findOne(id: number) {
    try {

      const postFound = await this.prisma.posts.findFirst({
        where: { id },
        include: {
          author: { // El campo que relacionado que se deseaa ver
            select: { // Las comlumnas que se desean ver de ese campo de relacion
              id: true,
              email: true,
              username: true,
              role_id: true,
            }
          }
        }
      });

      if (!postFound) throw new NotFoundException();

      return postFound;

    } catch (error) {

      // manejar instancias de errores
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException()

    }
  }

  /**
  * Actualiza un post específico en la base de datos.
  * @param id - ID del post a actualizar.
  * @param data - DTO con los datos a actualizar.
  * @returns El post actualizado.
  * @throws NotFoundException - Si no se encuentra el post.
  * @throws InternalServerErrorException - Si ocurre un error durante la actualización.
  */
  async update(id: number, data: UpdatePostDto) {
    try {

      const validator = new Validator(this.prisma);
      await validator.existThisId(id, 'posts');

      return await this.prisma.posts.update({
        where: { id },
        data
      });

    } catch (error) {
      // Si el error es una excepción conocida, la re-lanzamos
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Manejo genérico para errores inesperados
      throw new InternalServerErrorException(
        "Ocurrió un error inesperado al actualizar el recurso"
      );
    }
  }

  /**
 * Elimina un post específico de la base de datos.
 * @param id - ID del post a eliminar.
 * @returns El post eliminado.
 * @throws NotFoundException - Si no se encuentra el post.
 * @throws InternalServerErrorException - Si ocurre un error durante la eliminación.
 */

  async remove(id: number) {
    try {

      const validator = new Validator(this.prisma);
      await validator.existThisId(id, 'posts');

      return await this.prisma.posts.delete({
        where: { id }
      });

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return new InternalServerErrorException()
    }
  }

}
