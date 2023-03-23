import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './artists/artists.schema';
import { AlbumsController } from './albums/albums.controller';
import { Album, AlbumSchema } from './albums/albums.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/hw_93'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
    ]),
  ],
  controllers: [AppController, ArtistsController, AlbumsController],
  providers: [AppService],
})
export class AppModule {}
