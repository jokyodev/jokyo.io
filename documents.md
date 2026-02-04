Account bunny : MorissaHadden7yiob@w966r.org

## ----------------------

- Xây dựng ứng dụng figma clone fullstack với Nexjts 16

- Xây dựng ứng dụng thiết kế đồ họa vector đa người dùng tương tự Figma. Dự án tập trung vào hiệu năng Real-time cao cấp, xử lý Canvas phức tạp và hệ thống quản lý khóa học (LMS) tích hợp, vận hành trên nền tảng Next.js 16 hiện đại nhất.

- Dự án này không chỉ là một ứng dụng web thông thường, mà là một thử thách kỹ thuật mô phỏng lại các tính năng cốt lõi của Figma. Bạn sẽ được trải nghiệm quy trình xây dựng một hệ thống từ con số 0 đến khi triển khai thực tế.

🛠 Các tính năng kỹ thuật nổi bật:
Real-time Canvas: Xử lý đồ họa vector trực tiếp trên trình duyệt, cho phép nhiều người dùng cùng thiết kế, di chuyển đối tượng và comment thời gian thực (tương tự tính năng Multiplayer của Figma).

Next.js 16 App Router: Tận dụng sức mạnh của Server Components và Streaming để mang lại tốc độ tải trang cực nhanh.

Hệ thống LMS thông minh: Quản lý khóa học với cấu trúc Course > Chapter > Lesson. Tích hợp trạng thái hoàn thành bài học (User Progress) và lưu trữ cache bằng Upstash Redis để tối ưu tốc độ Sidebar.

Database mạnh mẽ: Sử dụng Neon (Serverless Postgres) với Prisma 7 để quản lý dữ liệu quan hệ, đảm bảo tính toàn vẹn cho dữ liệu người dùng và tiến độ học tập.

Bảo mật & Phân quyền: Hệ thống Role-based Access Control (RBAC) cho phép phân chia quyền hạn giữa Admin (người tạo khóa học) và Học viên.

Chế độ Bảo trì (Maintenance Mode): Quản lý trạng thái hệ thống thông qua SiteConfiguration, cho phép Admin đóng/mở web linh hoạt kèm theo countdown.

🏗 Kiến trúc hệ thống:
Frontend: React 19+, Tailwind CSS, ShadcnUI, Fabric.js (cho Canvas).

Backend: tRPC (Type-safe API), Next.js Server Actions.

Caching Layer: Redis Upstash để lưu trữ cấu trúc khóa học và session.

Storage: Upload và quản lý Video/Thumbnail thông qua S3 hoặc Uploadthing.

🎯 Mục tiêu dự án
Dự án giúp lập trình viên làm chủ các kỹ thuật khó nhất hiện nay: xử lý dữ liệu lồng nhau phức tạp, tối ưu hóa truy vấn Database với hàng trăm ngàn dòng dữ liệu tiến độ, và tư duy kiến trúc hệ thống Scalable.

Giới thiệu và Setup
Tổng quan dự án Figma Clone
