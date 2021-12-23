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
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { LanguageCode } from 'src/common/entity-enum';
import { ApiResponse } from 'src/utils';
import { ColorsService } from './colors.service';
import { ColorDataResponseDto } from './dto/color-data-res.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ResponseDataInterceptor } from 'src/common/interceptors/response.interceptor';
import { Color } from './entities/color.entity';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  @UsePipes(ValidationPipe)
  async create(
    @Body() createColorDto: CreateColorDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<Color> {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  async findAll(): // @Req() request: Request,
  // @Res({ passthrough: true }) response: Response,
  Promise<Color[]> {
    // response.cookie('test', 'abcde' + Date.now(), {
    //   expires: new Date(new Date().getTime() + 30 * 1000),
    //   sameSite: 'strict',
    //   httpOnly: true,
    // });
    return this.colorsService.findAll();
  }

  @Get('/fetch_available')
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  async findAvailable(): Promise<Color[]> {
    return this.colorsService.findAvailable();
  }

  @Get('/:id')
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  async findOne(@Param('id') id: string): Promise<Color> {
    return this.colorsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UseInterceptors(new ResponseDataInterceptor(new ColorDataResponseDto()))
  async remove(@Param('id') id: string): Promise<Color> {
    return this.colorsService.remove(id);
  }
}
