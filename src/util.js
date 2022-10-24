import path from 'path';
import process from 'process';

export function toRelativePath(abs) {
  return path.relative(process.cwd(), abs);
}

export default { };
