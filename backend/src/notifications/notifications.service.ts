import { Injectable, Logger } from '@nestjs/common';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class NotificationsService {
  private expo = new Expo();
  private readonly logger = new Logger(NotificationsService.name);

  async sendPushNotification(pushToken: string, message: string, data?: any) {
    if (!Expo.isExpoPushToken(pushToken)) {
      this.logger.error(
        `Push token ${pushToken} is not a valid Expo push token`,
      );
      return;
    }

    const messages: ExpoPushMessage[] = [];
    messages.push({
      to: pushToken,
      sound: 'default',
      body: message,
      data: { withSome: 'data', ...data },
    });

    try {
      const ticketChunk = await this.expo.sendPushNotificationsAsync(messages);
      this.logger.log(`Notification sent: ${JSON.stringify(ticketChunk)}`);
    } catch (error) {
      this.logger.error('Error sending notification', error);
    }
  }
}
