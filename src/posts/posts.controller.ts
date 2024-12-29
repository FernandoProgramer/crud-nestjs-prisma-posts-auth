import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Roles('admin', 'visitor', 'superadmin')
    create(@Body() createPostDto: CreatePostDto, @Request() req) {
        return this.postsService.create(createPostDto, req);
    }

    @Get()
    @Roles('admin', 'visitor')
    @UseGuards(AuthGuard, RolesGuard)
    findAll(@Request() req) {
        return this.postsService.findAll(req);
    }

    @Get(':id')
    @Roles('admin', 'visitor', 'superadmin')
    @UseGuards(AuthGuard)
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(parseInt(id));
    }

    @Patch(':id')
    @Roles('admin', 'visitor', 'superadmin')
    @UseGuards(AuthGuard)
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(parseInt(id), updatePostDto);
    }

    @Delete(':id')
    @Roles('admin', 'visitor', 'superadmin')
    @UseGuards(AuthGuard)
    remove(@Param('id') id: string) {
        return this.postsService.remove(parseInt(id));
    }
}
