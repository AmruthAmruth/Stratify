// Global type declarations

// Razorpay payment gateway
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id: string;
    subscription_id?: string;
    handler: (response: RazorpayResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
        color?: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    razorpay_subscription_id?: string;
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
}

interface RazorpayConstructor {
    new(options: RazorpayOptions): RazorpayInstance;
}

// ZegoUIKitPrebuilt for video calls
interface ZegoRoomConfig {
    container: HTMLElement | null;
    scenario: {
        mode: unknown;
    };
    showScreenSharingButton?: boolean;
    showPreJoinView?: boolean;
    showRoomTimer?: boolean;
    maxUsers?: number;
    turnOnCameraWhenJoining?: boolean;
    turnOnMicrophoneWhenJoining?: boolean;
    showLeavingView?: boolean;
    onLeaveRoom?: () => void;
}

interface ZegoUIKitPrebuiltInstance {
    joinRoom: (config: ZegoRoomConfig) => void;
    destroy?: () => void;
}

interface ZegoUIKitPrebuiltStatic {
    generateKitTokenForTest: (
        appID: number,
        serverSecret: string,
        roomID: string,
        userID: string,
        userName: string
    ) => string;
    create: (kitToken: string) => ZegoUIKitPrebuiltInstance;
    VideoConference: unknown;
    OTHERS?: {
        CONFERENCE?: unknown;
    };
}

// Extend Window interface
declare global {
    interface Window {
        Razorpay: RazorpayConstructor;
        ZegoUIKitPrebuilt: ZegoUIKitPrebuiltStatic;
    }
}

export { };
