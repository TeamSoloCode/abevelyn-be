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
  Req,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Next,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { LanguageCode } from 'src/common/entity-enum';
import { ApiDataResponse, AuthGuards } from 'src/utils';
import { ColorsService } from './colors.service';
import { ColorDataResponseDto } from './dto/color-data-res.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { Color } from './entities/color.entity';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseInterceptor } from 'src/common/interceptors/api-response.interceptor';
@ApiTags('Color APIs')
@ApiHeader({ name: 'language', enum: LanguageCode })
@Controller('colors')
@UseInterceptors(new ApiResponseInterceptor())
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  @UsePipes(ValidationPipe)
  async create(@Body() createColorDto: CreateColorDto): Promise<Color> {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiDataResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ColorDataResponseDto) },
            },
          },
        },
      ],
    },
  })
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  async findAll(): Promise<Color[]> {
    return this.colorsService.findAll();
  }

  @Get('/fetch_available')
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  async findAvailable(
    @Res({ passthrough: true }) response: Response,
  ): Promise<Color[]> {
    return this.colorsService.findAvailable();
  }

  @Get('/:id')
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  async findOne(@Param('id') id: string): Promise<Color> {
    return this.colorsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(...AuthGuards, AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('access-token')
  async update(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    return this.colorsService.update(id, updateColorDto);
  }
}
