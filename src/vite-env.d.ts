// / <reference types="vite/client" />
// / <reference types="swiper/swiper-react" />


/// <reference types="vite/client" />
/// <reference types="swiper/swiper-react" />

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    query_id?: string;
                    user?: {
                        id: number;
                        first_name: string;
                        last_name?: string;
                        username?: string;
                        language_code?: string;
                    };
                    auth_date?: string;
                    hash?: string;
                };
                ready(): void;
                close(): void;
                expand(): void;
                sendData(data: string): void;
            };
        };
    }
}

export { };
