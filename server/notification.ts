import { Booking, Test } from "@shared/schema";
import { format, subHours, subMinutes } from "date-fns";

export interface ScheduledNotification {
    bookingId: number;
    type: "fasting_start_reminder" | "fasting_start" | "appointment_reminder" | "eat_meal_now";
    scheduledTime: Date;
    message: string;
}

const mockNotificationQueue: ScheduledNotification[] = [];

export function scheduleFastingNotifications(booking: Booking, bookedTests: Test[]) {
    // Determine if fasting or postprandial tests exist
    let hasPostprandial = false;
    let maxFastingDuration = 0;

    for (const test of bookedTests) {
        if (test.isPostprandial) {
            hasPostprandial = true;
        }
        if (test.fastingRequired && test.fastingDuration > maxFastingDuration) {
            maxFastingDuration = test.fastingDuration;
        }
    }

    // Parse appointment time
    // Combine bookingDate (YYYY-MM-DD string) and timeSlot (e.g. "08:00 AM")
    const dateStr = booking.bookingDate.toString(); // assuming it's kept as string or parseable
    const appointmentTime = getAppointmentTime(dateStr, booking.timeSlot);

    if (!appointmentTime) return;

    // 1. Longest fasting duration
    if (maxFastingDuration > 0) {
        const fastingStartTime = subHours(appointmentTime, maxFastingDuration);

        const startTimeStr = format(fastingStartTime, "hh:mm a (MMM do)");
        const durationStr = `${maxFastingDuration} hours`;

        // Notifications Message Body
        const msgTemplate = `Fasting duration: ${durationStr}\nExact fasting start time: ${startTimeStr}\nAppointment time: ${format(appointmentTime, "hh:mm a (MMM do)")}\nWater allowed: Yes\nAvoid alcohol and heavy meals before fasting.`;

        // Schedule 12 hours before fasting starts
        mockNotificationQueue.push({
            bookingId: booking.id,
            type: "fasting_start_reminder",
            scheduledTime: subHours(fastingStartTime, 12),
            message: `[Reminder] Your fasting starts in 12 hours. \n\n${msgTemplate}`
        });

        // Schedule exact fasting start time
        mockNotificationQueue.push({
            bookingId: booking.id,
            type: "fasting_start",
            scheduledTime: fastingStartTime,
            message: `[Action] Start fasting now. \n\n${msgTemplate}`
        });

        // Schedule 2 hours before appointment
        mockNotificationQueue.push({
            bookingId: booking.id,
            type: "appointment_reminder",
            scheduledTime: subHours(appointmentTime, 2),
            message: `[Reminder] Your appointment is in 2 hours. See you at ${format(appointmentTime, "hh:mm a")}.`
        });
    }

    if (hasPostprandial) {
        // Schedule exactly 2 hours before appointment for meal
        const eatMealTime = subHours(appointmentTime, 2);
        mockNotificationQueue.push({
            bookingId: booking.id,
            type: "eat_meal_now",
            scheduledTime: eatMealTime,
            message: `Eat your meal now. Test is required exactly 2 hours after eating.`
        });
    }

    console.log(`[Notification Service] Scheduled ${mockNotificationQueue.filter(q => q.bookingId === booking.id).length} notifications for booking #${booking.id}`);

    // Note: in a real application, you'd insert these into a database table
    // and have a worker/cron checking for records where scheduledTime <= now()
}

// Utility mapper 
function getAppointmentTime(datePart: string, timePart: string): Date | null {
    try {
        // expected format: 'YYYY-MM-DD', 'HH:MM AM'
        const [time, period] = timePart.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const d = new Date(datePart);
        d.setHours(hours, minutes, 0, 0);
        return d;
    } catch (e) {
        return null;
    }
}

// Mock Engine to fire notifications 
setInterval(() => {
    const now = new Date();
    for (let i = mockNotificationQueue.length - 1; i >= 0; i--) {
        const notif = mockNotificationQueue[i];
        if (now >= notif.scheduledTime) {
            // Simulate sending SMS/WA/Email
            console.log(`\n\n------------------ NOTIFICATION ------------------`);
            console.log(`Sending to Booking #${notif.bookingId} via SMS, WhatsApp, Email...`);
            console.log(`TYPE: ${notif.type}`);
            console.log(`MESSAGE:\n${notif.message}`);
            console.log(`-------------------------------------------------\n\n`);

            // Remove from queue
            mockNotificationQueue.splice(i, 1);
        }
    }
}, 60000); // Check every minute
