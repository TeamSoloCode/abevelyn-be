import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { ResponseDataInterceptor } from '../common/interceptors/response.interceptor';
import { MaterialResponseDto } from './dto/material-data-response.dto';
import { Material } from './entities/material.entity';
import { FetchDataQuery } from '../common/fetch-data-query';
import { FetchDataQueryValidationPipe } from '../auth/pipes/fetch-data-query.pipe';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';
import { ApiResponseInterceptor } from '../common/interceptors/api-response.interceptor';
import { AuthGuards } from '../utils';

@Controller('materials')
@UseInterceptors(new ApiResponseInterceptor())
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new MaterialResponseDto()))
  @UsePipes(ValidationPipe)
  create(@Body() createMaterialDto: CreateMaterialDto) {
    return this.materialsService.create(createMaterialDto);
  }

  @Get()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new MaterialResponseDto()))
  findAll(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<Material[]> {
    return this.materialsService.findAllMaterial(query);
  }

  @Get('/fetch_available')
  @UseInterceptors(new ResponseDataInterceptor(new MaterialResponseDto()))
  async findAvailable(
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<Material[]> {
    return this.materialsService.fetchAvailableMaterial(query);
  }

  @Get(':id')
  @UseInterceptors(new ResponseDataInterceptor(new MaterialResponseDto()))
  findOne(@Param('id') id: string) {
    return this.materialsService.fetchOneMaterial(id);
  }

  @Patch(':id')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new MaterialResponseDto()))
  update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    return this.materialsService.update(id, updateMaterialDto);
  }
}
