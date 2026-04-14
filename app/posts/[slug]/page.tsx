import { redirect } from 'next/navigation';

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  redirect('/galleries');
}
