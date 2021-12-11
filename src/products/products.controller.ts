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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { ApiResponse } from 'src/utils';
import { Product } from './entities/product.entity';
import { AdminProductResponseDto } from './dto/admin-product-res.dto';
import { diskStorage, Express } from 'multer';
import { join } from 'path';
import { deleteUnusedImage, editFileName, imageFileFilter } from '../utils';

import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          editFileName(req, file, callback, 'product');
        },
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ApiResponse<AdminProductResponseDto>> {
    const product = await this.productsService.create({
      ...createProductDto,
      image: image.filename,
    });
    const res = new AdminProductResponseDto(product, headerInfo.language);
    return new ApiResponse(res, 'Create product successfull');
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async findAll(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminProductResponseDto[]>> {
    const products = await this.productsService.findAll();
    const res = products.map(
      (product) => new AdminProductResponseDto(product, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get('/fetch_available')
  async findAvailableCollection(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminProductResponseDto[]>> {
    const productStatus = await this.productsService.findAvailable();
    const res = productStatus.map(
      (status) => new AdminProductResponseDto(status, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
