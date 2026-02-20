'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '../actions'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export default function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(
        null
    )
    const [message, setMessage] = useState('')

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            navigator.serviceWorker.ready
                .then((registration) => {
                    return registration.pushManager.getSubscription()
                })
                .then((sub) => {
                    setSubscription(sub)
                })
                .catch((err) => {
                    console.error('Error getting subscription:', err)
                })
        }
    }, [])

    const subscribeToPush = async () => {
        try {
            console.log('Starting subscription process...')
            const registration = await navigator.serviceWorker.ready
            console.log('SW ready:', registration.scope)

            // Check current permission
            console.log('Requesting notification permission...')
            const perm = await Notification.requestPermission()
            console.log('Permission status:', perm)
            if (perm !== 'granted') {
                alert('Por favor permite las notificaciones en el navegador. Estado actual: ' + perm)
                return
            }

            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            if (!vapidPublicKey) {
                console.error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing')
                alert('Error: Llave pública VAPID no configurada')
                return
            }

            console.log('Subscribing to push manager...')
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            })
            console.log('Push subscription successful:', sub)

            setSubscription(sub)
            const serializedSub = JSON.parse(JSON.stringify(sub))
            console.log('Sending subscription to server...')
            const result = await subscribeUser(serializedSub)
            console.log('Server subscription result:', result)

            if (result.success) {
                alert('Suscrito correctamente!')
            } else {
                const errorMsg = (result as any).error || 'Error desconocido'
                alert('Servidor no pudo guardar la suscripción: ' + errorMsg)
            }
        } catch (err) {
            console.error('Detailed subscription error:', err)
            alert('Error al suscribirse (revisa la consola): ' + err)
        }
    }

    async function unsubscribeFromPush() {
        await subscription?.unsubscribe()
        setSubscription(null)
        await unsubscribeUser()
    }

    async function sendTestNotification() {
        if (subscription) {
            await sendNotification(message)
            setMessage('')
        }
    }

    if (!isSupported) {
        return <p>Push notifications are not supported in this browser.</p>
    }

    return (
        <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto mt-10">
            <h3 className="text-xl font-bold mb-4">Push Notifications</h3>
            {subscription ? (
                <div className="space-y-4">
                    <p className="text-green-600">You are subscribed to push notifications.</p>
                    <button
                        onClick={unsubscribeFromPush}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Unsubscribe
                    </button>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter notification message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="border p-2 rounded grow"
                        />
                        <button
                            onClick={sendTestNotification}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Send Test
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <p>You are not subscribed to push notifications.</p>
                    <button
                        onClick={subscribeToPush}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Subscribe
                    </button>
                </div>
            )}
        </div>
    )
}
