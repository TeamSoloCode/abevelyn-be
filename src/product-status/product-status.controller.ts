import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductStatusService } from './product-status.service';
import { CreateProductStatusDto } from './dto/create-product-status.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { ApiResponse } from 'src/utils';
import { AdminProductStatusResponseDto } from './dto/admin-product-status-res.dto';
import {
  GetHeaderInfo,
  HeaderInfo,
} from 'src/auth/decorators/get-language.decorator';

@Controller('product_status')
export class ProductStatusController {
  constructor(private readonly productStatusService: ProductStatusService) {}

  @Post()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async create(
    @Body() createProductStatusDto: CreateProductStatusDto,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminProductStatusResponseDto>> {
    const productStatus = await this.productStatusService.create(
      createProductStatusDto,
    );
    const res = new AdminProductStatusResponseDto(
      productStatus,
      headerInfo.language,
    );
    return new ApiResponse(res);
  }

  @Get()
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async findAll(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminProductStatusResponseDto[]>> {
    const productStatus = await this.productStatusService.findAll();
    const res = productStatus.map(
      (status) =>
        new AdminProductStatusResponseDto(status, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get('/fetch_available')
  async findAvailableCollection(
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminProductStatusResponseDto[]>> {
    const productStatus = await this.productStatusService.findAvailable();
    const res = productStatus.map(
      (status) =>
        new AdminProductStatusResponseDto(status, headerInfo.language),
    );
    return new ApiResponse(res);
  }

  @Get('/:id')
  async findOne(
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Param('id') id: string,
  ): Promise<ApiResponse<AdminProductStatusResponseDto>> {
    const productStatus = await this.productStatusService.findOne(id);
    const res = new AdminProductStatusResponseDto(
      productStatus,
      headerInfo.language,
    );
    return new ApiResponse(res);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
    @Body() updateProductStatusDto: UpdateProductStatusDto,
  ): Promise<ApiResponse<AdminProductStatusResponseDto>> {
    const productStatus = await this.productStatusService.update(
      id,
      updateProductStatusDto,
    );
    const res = new AdminProductStatusResponseDto(
      productStatus,
      headerInfo.language,
    );
    return new ApiResponse(res);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), AdminRoleGuard)
  async remove(
    @Param('id') id: string,
    @GetHeaderInfo() headerInfo: HeaderInfo,
  ): Promise<ApiResponse<AdminProductStatusResponseDto>> {
    const productStatus = await this.productStatusService.remove(id);
    const res = new AdminProductStatusResponseDto(
      productStatus,
      headerInfo.language,
    );
    return new ApiResponse(res);
  }
}
