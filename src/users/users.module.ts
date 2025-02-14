import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User} from './user.entity';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';
import { Genre } from 'src/genres/genre.entity';
import { Movie } from 'src/movie/movie.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { MovieGenre } from 'src/middleEntities/movie_genre.entity';
import { EmailService } from 'src/services/email.service';
import { UserGenre } from 'src/middleEntities/user_genre.entity';
import { UserMovie } from 'src/middleEntities/user_movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Genre,Movie,MovieGenre,UserGenre,UserMovie]),
  MailerModule.forRoot({
    transport: {
      host: 'sandbox.smtp.mailtrap.io',  
      port: 2525,                        
      auth: {
        user: '54b5abaf50a933',  
        pass: 'eaa11c2447bc92',  
      }
    },
    defaults: {
      from: '"No Reply" <noreply@example.com>',  
    },
    preview: false, 
  })],
  controllers: [UsersController],
  providers: [UsersService,AuthService,EmailService]
})
export class UsersModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}

