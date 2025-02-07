import { registerAs } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';


export default () => ({
    PRIVATE_KEY: readFileSync(join(__dirname, '../../private.key'), 'utf8'),
    PUBLIC_KEY: readFileSync(join(__dirname, '../../public.key'), 'utf8'),
})
