import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FetchDataQueryValidationPipe } from 'src/auth/pipes/fetch-data-query.pipe';
import { FetchDataQuery } from 'src/common/fetch-data-query';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { UserProfileResponseDTO } from './dto/profile-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User Profile APIs')
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  create(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @GetUser() user: User,
  ) {
    return this.userProfileService.create(createUserProfileDto, user);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new UserProfileResponseDTO()))
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.userProfileService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @UseInterceptors(new ResponseDataInterceptor(new UserProfileResponseDTO()))
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.userProfileService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @GetUser() user: User,
  ) {
    return this.userProfileService.update(id, updateUserProfileDto, user);
  }
}
