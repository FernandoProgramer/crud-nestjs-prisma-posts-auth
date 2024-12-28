import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validaciones sencillas para el envio de datos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  // Permitir que desde otro dominio sea accesible los endpoints
  app.enableCors()


  /* Iniciar servidor */
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
