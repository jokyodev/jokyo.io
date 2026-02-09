declare module "*.css";

declare module "player.js" {
  export class Player {
    constructor(iframe: HTMLIFrameElement | string);
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback?: () => void): void;
    get(method: string, callback: (value: any) => void): void;
    set(method: string, value: any): void;
    call(method: string, value?: any): void;
    // Thêm các method hay dùng nếu cần
    play(): void;
    pause(): void;
    setCurrentTime(seconds: number): void;
    getCurrentTime(callback: (seconds: number) => void): void;
  }
}
