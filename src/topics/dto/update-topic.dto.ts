import { PartialType } from '@nestjs/swagger';
import { CreatetopicDto } from './create-topic.dto';

export class UpdatetopicDto extends PartialType(CreatetopicDto) {}
