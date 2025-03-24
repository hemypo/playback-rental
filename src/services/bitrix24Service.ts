import axios from 'axios';
import { Product, BookingFormData } from '@/types/product';

// Bitrix24 API configuration
const WEBHOOK_URL = import.meta.env.VITE_BITRIX24_WEBHOOK_URL || '';

export const createLeadFromBooking = async (booking: BookingFormData, product: Product): Promise<boolean> => {
  if (!WEBHOOK_URL) {
    console.error('Bitrix24 webhook URL not configured');
    return false;
  }

  try {
    // Format date range
    const dateStart = booking.startDate.toLocaleDateString('ru-RU');
    const dateEnd = booking.endDate.toLocaleDateString('ru-RU');
    
    // Build lead data
    const leadData = {
      fields: {
        TITLE: `Бронирование ${product.title}`,
        NAME: booking.name.split(' ')[0] || '',
        LAST_NAME: booking.name.split(' ').slice(1).join(' ') || '',
        STATUS_ID: 'NEW',
        OPENED: 'Y',
        ASSIGNED_BY_ID: 1, // Default to admin user
        PHONE: [{ VALUE: booking.phone, VALUE_TYPE: 'WORK' }],
        EMAIL: [{ VALUE: booking.email, VALUE_TYPE: 'WORK' }],
        COMMENTS: `
          Товар: ${product.title}
          Период аренды: ${dateStart} - ${dateEnd}
          Цена товара (в день): ${product.price} руб.
          Дополнительная информация: ${booking.notes || 'Не указано'}
        `,
        SOURCE_ID: 'WEB',
        SOURCE_DESCRIPTION: 'Заявка с сайта проката',
      }
    };

    // Send data to Bitrix24
    const response = await axios.post(`${WEBHOOK_URL}/crm.lead.add`, leadData);
    
    return response.data && response.data.result > 0;
  } catch (error) {
    console.error('Failed to create lead in Bitrix24:', error);
    return false;
  }
};

export const sendDealToManager = async (booking: BookingFormData, product: Product): Promise<boolean> => {
  // This is a placeholder function to send notification to manager
  // In a real implementation, this could use Bitrix24 chat API or email notification
  
  try {
    // For now, we'll just log that this would be sent
    console.log('Would send notification to manager about booking:', {
      product: product.title,
      customer: booking.name,
      phone: booking.phone,
      email: booking.email,
      period: `${booking.startDate.toLocaleDateString()} - ${booking.endDate.toLocaleDateString()}`
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send notification to manager:', error);
    return false;
  }
};
