import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('artists')
export class ArtistsController {
  @Get()
  getAll() {
    return { message: 'All artists!' };
  }
  @Get(':id')
  getOneArtist(@Param('id') id: string) {
    return { message: 'One Artists' + id };
  }
  @Post()
  creatArtist() {
    return { message: 'Ok!' };
  }
}
