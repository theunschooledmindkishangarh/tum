export interface ValuePillar {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  emoji: string;
  offset3d: { x: number; y: number; z: number };
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description: string;
  activity: string;
}

export interface VideoItem {
  id: string;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  duration: string;
  category: string;
}

export interface SchoolActivity {
  id: string;
  title: string;
  description: string;
  iconName: string;
  colorTheme: string;
  benefits: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  snippet: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  content: string;
}

