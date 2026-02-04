export const CACHE_KEYS = {
  // Quản lý theo từng đối tượng (Course, User, Lesson...)
  course: {
    structure: (slug: string) => `course:v1:structure:${slug}`,
    content: (id: string) => `course:v1:lesson:${id}`,
  },
  user: {
    progress: (userId: string, courseSlug: string) =>
      `user:v1:${userId}:progress:${courseSlug}`,
  },
};
