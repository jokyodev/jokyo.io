export const CACHE_KEYS = {
  // Quản lý theo từng đối tượng (Course, User, Lesson...)
  course: {
    detail: (slug: string) => `course:v1:detail:${slug}`,
    structure: (slug: string) => `course:v1:structure:${slug}`,
    content: (id: string) => `course:v1:lesson:${id}`,
    all: `course:v1`,
  },
  user: {
    progress: (userId: string, courseSlug: string) =>
      `user:v1:${userId}:progress:${courseSlug}`,
  },
};
