'use server'

import webpush, { type PushSubscription } from 'web-push'
import fs from 'fs'
import path from 'path'

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
)

const SUBSCRIPTION_FILE = path.join(process.cwd(), '.subscription-debug.json')

let subscription: PushSubscription | null = null

// Load subscription from file if it exists (for dev persistence)
if (fs.existsSync(SUBSCRIPTION_FILE)) {
    try {
        const data = fs.readFileSync(SUBSCRIPTION_FILE, 'utf8')
        subscription = JSON.parse(data)
        console.log('Loaded persisted subscription from .subscription-debug.json')
    } catch (e) {
        console.error('Failed to load persisted subscription:', e)
    }
}

export async function subscribeUser(sub: PushSubscription): Promise<{ success: boolean; error?: string }> {
    console.log('Received subscription on server:', JSON.stringify(sub))
    subscription = sub

    // Persist to file for dev
    try {
        fs.writeFileSync(SUBSCRIPTION_FILE, JSON.stringify(sub))
        console.log('Persisted subscription to .subscription-debug.json')
    } catch (e) {
        console.error('Failed to persist subscription:', e)
    }

    return { success: true }
}

export async function unsubscribeUser(): Promise<{ success: boolean; error?: string }> {
    console.log('Unsubscribing user on server')
    subscription = null
    // In a production environment, you would want to remove the subscription from the database
    // For example: await db.subscriptions.delete({ where: { ... } })
    return { success: true }
}

export async function sendNotification(message: string) {
    console.log('Attempting to send notification:', message)
    if (!subscription) {
        console.error('Send failed: No subscription available on server')
        return { success: false, error: 'No subscription available. Please re-subscribe.' }
    }

    try {
        console.log('Sending push notification to subscription...')
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: 'Test Notification',
                body: message,
                icon: '/icons/android-chrome-192x192.png',
            })
        )
        console.log('Push notification sent successfully')
        return { success: true }
    } catch (error: any) {
        console.error('Error sending push notification:', error)
        return {
            success: false,
            error: error.message || 'Failed to send notification'
        }
    }
}
