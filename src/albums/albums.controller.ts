import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from './albums.schema';
import { CreateAlbumDto } from './create-albums.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}
  @Get()
  async getAll() {
    return this.albumModel.find();
  }
  @Get(':id')
  async getOneAlbum(@Param('id') id: string) {
    return this.albumModel.find({ _id: id });
  }
  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: '.public/uploads/albums' }))
  async creatAlbum(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumData: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      artist: albumData.artist,
      name: albumData.name,
      year: albumData.year,
      image: file ? '/uploads/albums/' + file.filename : null,
    });
    return album.save();
  }
}
