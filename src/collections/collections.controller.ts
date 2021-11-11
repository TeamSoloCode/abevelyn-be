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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { MatchStoredTokenGuard } from 'src/auth/guards/match-token.guard';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Get()
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get('/fetch_available')
  findAvailableCollection() {
    return this.collectionsService.findAvailableCollection();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), MatchStoredTokenGuard, AdminRoleGuard)
  remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}
