import { FileText, Download, Image as ImageIcon, Video, Music, File } from "lucide-react";

interface MediaMessageProps {
    messageType?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    message?: string;
}

const MediaMessage = ({
    messageType,
    fileUrl,
    fileName,
    fileSize,
    mimeType,
    message
}: MediaMessageProps) => {
    if (!messageType || messageType === "text") {
        return null;
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return "";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const getFileIcon = () => {
        if (mimeType?.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
        if (mimeType?.startsWith("video/")) return <Video className="w-5 h-5" />;
        if (mimeType?.startsWith("audio/")) return <Music className="w-5 h-5" />;
        if (mimeType === "application/pdf") return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    if (messageType === "image" && fileUrl) {
        return (
            <div className="space-y-2">
                <div className="rounded-lg overflow-hidden max-w-sm cursor-pointer hover:opacity-90 transition-opacity">
                    <img
                        src={fileUrl}
                        alt={fileName || "Image"}
                        className="w-full h-auto object-cover"
                        onClick={() => window.open(fileUrl, "_blank")}
                    />
                </div>
                {message && <p className="break-words">{message}</p>}
            </div>
        );
    }

    if (messageType === "video" && fileUrl) {
        return (
            <div className="space-y-2">
                <video
                    src={fileUrl}
                    controls
                    className="rounded-lg max-w-sm w-full"
                />
                {message && <p className="break-words">{message}</p>}
            </div>
        );
    }

    if (messageType === "document" || messageType === "audio") {
        return (
            <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20">
                    <div className="flex-shrink-0 text-white/70">
                        {getFileIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{fileName || "File"}</p>
                        <p className="text-xs opacity-70">{formatFileSize(fileSize)}</p>
                    </div>
                    {fileUrl && (
                        <a
                            href={fileUrl}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    )}
                </div>
                {message && <p className="break-words">{message}</p>}
            </div>
        );
    }

    return null;
};

export default MediaMessage;
