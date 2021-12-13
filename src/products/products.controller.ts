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
  Query,
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
import { FetchDataQuery } from 'src/fetch-data-query';
import { FetchDataQueryValidationPipe } from 'src/auth/pipes/fetch-data-query.pipe';

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
    @Query(ValidationPipe, FetchDataQueryValidationPipe)
    query: FetchDataQuery,
  ): Promise<ApiResponse<AdminProductResponseDto[]>> {
    const productStatus = await this.productsService.findAvailable(query);
    const res = productStatus.map(
      (status) => new AdminProductResponseDto(status, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get('/:id')
  async findOne(
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Param('id') id: string,
  ): Promise<ApiResponse<AdminProductResponseDto>> {
    const product = await this.productsService.findOne(id);
    const res = new AdminProductResponseDto(product, headerInfo.language);
    return new ApiResponse(res);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            editFileName(req, file, callback, 'product');
          },
        }),
        fileFilter: imageFileFilter,
      },
    ),
  )
  async update(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      image1?: Express.Multer.File[];
      image2?: Express.Multer.File[];
      image3?: Express.Multer.File[];
      image4?: Express.Multer.File[];
      image5?: Express.Multer.File[];
    },
  ): Promise<ApiResponse<AdminProductResponseDto>> {
    const product = await this.productsService.update(id, {
      ...updateProductDto,
      image: files.image?.[0]?.filename,
      image1: files.image1?.[0]?.filename,
      image2: files.image2?.[0]?.filename,
      image3: files.image3?.[0]?.filename,
      image4: files.image4?.[0]?.filename,
      image5: files.image5?.[0]?.filename,
    });
    const res = new AdminProductResponseDto(product, headerInfo.language);
    return new ApiResponse(res, 'Update product successfull!');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
