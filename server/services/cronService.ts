import cron from 'node-cron';
import { BookingModel } from '../models/Booking';
import { TestModel } from '../models/Test';

export const setupCronJobs = () => {
  // Run every hour to check for bookings coming up in 10-12 hours
  cron.schedule('0 * * * *', async () => {
    console.log('Running hourly WhatsApp reminder cron job...');
    try {
      const now = new Date();
      
      const upcomingBookings = await BookingModel.find({
        status: { $in: ['pending', 'confirmed'] },
        reminderSent: false
      });

      for (const booking of upcomingBookings) {
        const dateTimeStr = `${booking.bookingDate} ${booking.timeSlot}`;
        const appointmentDate = new Date(dateTimeStr);
        
        if (!isNaN(appointmentDate.getTime())) {
          const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          if (hoursDifference >= 10 && hoursDifference <= 12) {
            let testName = "Medical Test";
            let fastingRequired = false;
            
            if (booking.testIds && booking.testIds.length > 0) {
              const test = await TestModel.findOne({ id: booking.testIds[0] });
              if (test) {
                testName = test.name;
                fastingRequired = test.fastingRequired;
              }
            }

            if (fastingRequired) {
              // TODO: Implement email/SMS reminders here since Twilio WhatsApp was removed
              // For now, just mark it as sent so we don't process it again
              booking.reminderSent = true;
              await booking.save();
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in cron reminder job:', error);
    }
  });

  console.log('Cron jobs are scheduled.');
};
