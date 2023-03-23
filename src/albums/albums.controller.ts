import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('albums')
export class AlbumsController {
  @Get()
  getAll() {
    return { message: 'All albums!' };
  }
  @Get(':id')
  getOneAlbum(@Param('id') id: string) {
    return { message: 'One Album' + id };
  }
  @Post()
  creatAlbum() {
    return { message: 'Ok!' };
  }
}
