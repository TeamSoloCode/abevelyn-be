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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { FetchDataQueryValidationPipe } from '../auth/pipes/fetch-data-query.pipe';
import { FetchDataQuery } from '../common/fetch-data-query';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { UserProfileResponseDTO } from './dto/profile-response.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { AuthGuards } from '../utils';

@ApiTags('User Profile APIs')
@ApiBearerAuth('access-token')
@Controller('user-profile')
@UseInterceptors(new ApiResponseInterceptor())
@UseGuards(...AuthGuards)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @ApiOperation({ summary: 'Create user profile' })
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(new ResponseDataInterceptor(new UserProfileResponseDTO()))
  create(
    @Body() createUserProfileDto: CreateUserProfileDto,
    @GetUser() user: User,
  ) {
    return this.userProfileService.create(createUserProfileDto, user);
  }

  @ApiOperation({ summary: 'Get all user profile (Admin only)' })
  @Get()
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new UserProfileResponseDTO()))
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ) {
    return this.userProfileService.findAll(query);
  }

  @ApiOperation({ summary: 'Get user profile by id (Admin only)' })
  @Get(':id')
  @UseGuards(AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new UserProfileResponseDTO()))
  findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }

  @ApiOperation({ summary: 'Return user profile' })
  @Get('my_profile')
  @UseInterceptors(new ResponseDataInterceptor(new UserProfileResponseDTO()))
  findProfileByUser(@GetUser() user: User) {
    return this.userProfileService.findProfileByOwner(user);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @Patch()
  @UsePipes(ValidationPipe)
  update(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @GetUser() user: User,
  ) {
    return this.userProfileService.update(updateUserProfileDto, user);
  }
}
