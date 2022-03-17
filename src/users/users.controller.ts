import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponseInterceptor } from 'src/common/interceptors/api-response.interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuards } from 'src/utils';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RootRoleGuard } from 'src/auth/guards/root-role.guard';
import { UpdateUserRoleDTO } from './dto/update-user-role.dto';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { UserDataResponse } from './dto/user-data-response.dto';

@ApiTags('User APIs')
@Controller('users')
@UseInterceptors(new ApiResponseInterceptor())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all user (Only be used by Admin)' })
  @ApiBearerAuth('access-token')
  @Get()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new UserDataResponse()))
  async findAll() {
    const users = await this.usersService.findAll(undefined, {
      relations: ['profile'],
    });
    return users;
  }

  @ApiOperation({ summary: 'Get user information (Only be used by Admin)' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user that you want to get info',
  })
  @Get('get-user/:id')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new UserDataResponse()))
  getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id, undefined, { relations: ['profile'] });
  }

  @ApiOperation({ summary: 'Update user role (Only be used by Root)' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    description: 'The uuid of the user that you want to update info',
  })
  @Patch('change-user-role/:id')
  @UseGuards(...AuthGuards, RootRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new UserDataResponse()))
  @UsePipes(ValidationPipe)
  updateUserRoleById(
    @Param('id') id: string,
    @Body() updateUserRoleDTO: UpdateUserRoleDTO,
  ) {
    return this.usersService.updateUserRoleById(id, updateUserRoleDTO);
  }

  @ApiOperation({ summary: 'Fetch user infomation' })
  @ApiBearerAuth('access-token')
  @Get('info')
  @UseGuards(...AuthGuards)
  @UseInterceptors(new ResponseDataInterceptor(new UserDataResponse()))
  findOne(@GetUser() user: User) {
    return this.usersService.findOne(user.uuid, undefined, {
      relations: ['profile'],
    });
  }
}
