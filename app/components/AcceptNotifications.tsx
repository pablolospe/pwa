"use client";

export default function NotificationBell() {
    const subscribeToNotifications = async () => {
        try {
            // 1. Verificamos si el navegador soporta notificaciones
            if (typeof window === "undefined" || !("Notification" in window)) {
                console.warn("Este navegador no soporta notificaciones de escritorio.");
                return;
            }

            // 2. Pedimos permiso
            console.log("Solicitando permiso de notificación...");
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
                console.log("¡Permiso concedido!");
                showWelcomeNotification();
            } else {
                console.log("Permiso de notificación:", permission);
            }
        } catch (error) {
            console.error("Error al solicitar permiso de notificación:", error);
        }
    };

    const showWelcomeNotification = () => {
        if (typeof navigator === "undefined" || !navigator.serviceWorker) return;

        navigator.serviceWorker.ready
            .then((registration) => {
                return registration.showNotification("¡TuFiesta Conectado!", {
                    body: "Ahora recibirás alertas de nuevas consultas aquí.",
                    icon: "/icons/android-chrome-192x192.png",
                    badge: "/icons/badge.png",
                });
            })
            .then(() => console.log("Notificación de bienvenida mostrada"))
            .catch((error) => {
                console.error("Error al mostrar notificación de bienvenida:", error);
            });
    };

    return (
        <button
            onClick={subscribeToNotifications}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
            Activar Notificaciones
        </button>
    );
}