export type CourseRaw = {
  likes_count: string;
  course_id: string;
  chalanges: string;
  completed_chalanges: string;
  rating: string | null;
  liked: string | null;
  total_lessons: string;
  my_rating: string | null;

  id: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  public: boolean;
  catalog: boolean;
  userId: string | null;
  draft: boolean;
  name: string;
  price: string;
  content_id: string;
  level: string;
  description: string;
  cover: string;
  preview: string | null;
  initial_enrolled: number;
  initial_likes: number;
  initial_stars: number;
  certificateId: string | null;
  customLevel: string | null;
  age: string;
  customAge: string | null;
  audience: string | null;
  for_teachers: string | null;
  is_global: boolean;
  progress: string;

  units: CourseUnitRaw[];
};

export type CourseUnitRaw = {
  id: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  name: string;
  avatar: string;
  background: string;
  initial_enrolled: number;
  initial_likes: number;
  initial_stars: number;
  description: string;
  tips: any[]; // could refine if needed
  duration: {
    hours: number;
    minutes: number;
  };
  sort: number;
  level: string;
  customLevel: string | null;
  age: string;
  customAge: string | null;
  grading: string;
  brief: string | null;
  audience: string | null;
  teacher_forum: string | null;
  lesson_plans: string | null;
  teacher_slides: string | null;
  meta: Record<string, any>;
};