import { Body,Controller,Post,Get,Param,Patch,Query,Delete,
  NotFoundException,BadRequestException,Session,UseInterceptors,
  UploadedFile} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interseptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateGenresSubscribtionDto } from './dtos/create-genres-subscribtion.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage} from 'multer';
import { v4 as uuidv4} from 'uuid';
import * as path from 'path';



export const storage = {storage:diskStorage({
  destination:'./uploads/profile-images',
  filename:(req,file,cb)=>{
    const filename:string = path.parse(file.originalname).name.replace(/\s/g,'')+uuidv4();
    const extension:string = path.parse(file.originalname).ext;
    cb(null,`${filename}${extension}`);}
  })
}

@ApiTags('Users')
@Controller('users')
//@UseInterceptors(CurrentUserInterceptor)
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService:UsersService,
    private authService:AuthService
   
  ){}
  @Post('/signup')
  async createUsers(@Body() body:CreateUserDto){
    const user = await this.authService.signup(body.email , body.password);
    return user;
  } 
 
  @Post('signin')
  async signin(@Body() body:CreateUserDto){
    const user = await this.authService.signin(body.email, body.password);
    return user;
  }

  @Post()
  createUser(@Body() body:CreateUserDto){
    const user = this.usersService.create(body);
    return user;
  }

  @Post('create-user-genre')
  async createUserGenre(@Body() createUserGenre:{userId:number, genreId:number}){
    await this.usersService.createUserGenre(createUserGenre);
  }

  
  @Post('create-user-movie')
  async createUserMovie(@Body() createUserMovie:{userId:number, movieId:number}){
    await this.usersService.createUserMovie(createUserMovie);
  }
  
 
  

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return await this.usersService.forgotPassword(email);
  }


  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }
    return await this.usersService.resetPassword(token, newPassword);
  }


  @Get('whoami')
  whoAmI(@CurrentUser() user:User){
    return user;
  }

  @Post('/signout')
  signOut(@Session() session:any){
    return session.userId= null;
  }

  @Get('/:id')
  async findUser(@Param('id') id:string){
    const user = await this.usersService.findOne(parseInt(id));
    if(!user){ 
      throw new NotFoundException('user not found');
    }
    return user;

  }

  @Get()
  findAllUsers(@Query('email') email:string){
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id:string){
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id:string ,@Body() body: UpdateUserDto){
    return this.usersService.update(parseInt(id), body);
  }

  @Post('/subscribe')
  createGenreSubscribtion(@Body() body:CreateGenresSubscribtionDto){
    return this.usersService.createSubscribtion(body);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file){
    console.log(file);
    return ({profileImage:file.filename});
  }

  @Patch('updateProfile/:id')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadNewFile(@UploadedFile() file,@Param('id') id:string ){
    console.log(file);
    return this.usersService.updateProfile(parseInt(id),{profileImage:file.filename} );
  }

}
