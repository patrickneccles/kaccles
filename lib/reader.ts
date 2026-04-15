import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

export default reader;

export async function getGalleries() {
  const galleries = await reader.collections.galleries.all();
  return galleries.sort((a, b) => {
    if (!a.entry.shootDate) return 1;
    if (!b.entry.shootDate) return -1;
    return b.entry.shootDate.localeCompare(a.entry.shootDate);
  });
}
