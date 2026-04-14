import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true,
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':    return '⏳ Pending';
      case 'confirmed':  return '✅ Confirmed';
      case 'completed':  return '🏁 Completed';
      case 'cancelled':  return '❌ Cancelled';
      default:           return status ?? '—';
    }
  }
}