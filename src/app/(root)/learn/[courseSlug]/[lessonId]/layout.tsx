import { ReactNode } from "react";
import Header from "./_components/header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* 1. Header cố định phía trên */}
      <Header />

      {/* 2. Phần thân chiếm hết khoảng trống còn lại */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content (Trái - 7 phần) */}
        <main className="flex-7 overflow-y-auto  p-4">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>

        {/* Right Bar (Phải - 2 phần) */}
        <aside className="flex-2 border-l  hidden lg:block overflow-y-auto">
          <div className="p-4">
            <h3 className="font-bold mb-4">Danh sách bài học</h3>
            {/* Content của Right bar */}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Layout;
