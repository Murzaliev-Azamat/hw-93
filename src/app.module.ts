import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artists.schema';
import { AlbumsController } from './albums/albums.controller';
import { Album, AlbumSchema } from './schemas/albums.schema';
import { TracksController } from './tracks/tracks.controller';
import { Track, TrackSchema } from './schemas/tracks.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.srategy';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/hw_93'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule,
  ],
  controllers: [
    AppController,
    ArtistsController,
    AlbumsController,
    TracksController,
    UsersController,
  ],
  providers: [AppService, AuthService, LocalStrategy],
})
export class AppModule {}
