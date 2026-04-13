import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusBadge', standalone: true })
export class StatusBadgePipe implements PipeTransform {
  transform(status: string): string {
    const map: Record<string, string> = {
      pending: '⏳ Pending',
      confirmed: '✅ Confirmed',
      completed: '🏁 Completed',
      cancelled: '❌ Cancelled',
    };
    return map[status] ?? status;
  }
}