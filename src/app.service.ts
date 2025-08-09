import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  MultipleDeviceNotificationDto,
  NotificationDto,
  TopicNotificationDto,
} from './dto/notification.dto';

@Injectable()
export class AppService {
  async sendNotification({ token, title, body, icon }: NotificationDto) {
    const response = await admin.messaging().send({
      token,
      webpush: {
        notification: {
          title,
          body,
          icon,
        },
      },
    });
    return response;
  }

  async sendNotificationToMultipleTokens({
    tokens,
    title,
    body,
    icon,
  }: MultipleDeviceNotificationDto) {
    const message = {
      notification: {
        title,
        body,
        icon,
      },
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('Successfully sent messages:', response);
      return {
        success: true,
        message: `Successfully sent ${response.responses.filter(r => r.success).length} messages; ${response.responses.filter(r => !r.success).length} failed.`,
      };
    } catch (error: unknown) {
      const err = error as Error;
      console.log('Error sending messages:', err.message);
      return { success: false, message: 'Failed to send notifications' };
    }
  }

  async sendTopicNotification({
    topic,
    title,
    body,
    icon,
  }: TopicNotificationDto) {
    const message = {
      notification: {
        title,
        body,
        icon,
      },
      topic,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return { success: true, message: 'Topic notification sent successfully' };
    } catch (error) {
      console.log('Error sending message:', error);
      return { success: false, message: 'Failed to send topic notification' };
    }
  }
}
