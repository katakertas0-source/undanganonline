import { GuestLink, RsvpEntry } from '@/types';

/**
 * Escapes CSV field value according to RFC 4180
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Triggers a browser download of a CSV file with UTF-8 BOM encoding for Excel compatibility
 */
export function downloadCsv(filename: string, headers: string[], rows: (string | number | boolean | null | undefined)[][]): void {
  if (typeof window === 'undefined') return;

  const headerLine = headers.map(escapeCsvValue).join(',');
  const rowLines = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\r\n');

  // \uFEFF is the UTF-8 Byte Order Mark (BOM) ensuring Excel displays characters properly
  const csvContent = '\uFEFF' + headerLine + '\r\n' + rowLines;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all registered guest links along with their RSVP status to CSV
 */
export function exportGuestsToCsv(
  invitationTitle: string,
  slug: string,
  guests: GuestLink[],
  rsvps: RsvpEntry[],
  baseUrl: string
): void {
  const headers = [
    'No',
    'Nama Tamu',
    'Kategori',
    'Nomor WhatsApp',
    'Status RSVP',
    'Jumlah Porsi (Pax)',
    'Catatan / Ucapan',
    'Link Undangan Personal',
    'Status Check-In Hari-H',
  ];

  const rsvpMap = new Map<string, RsvpEntry>();
  rsvps.forEach((r) => {
    rsvpMap.set(r.guestName.toLowerCase().trim(), r);
  });

  const rows = guests.map((guest, index) => {
    const guestUrl = `${baseUrl}/${slug}/${guest.guestSlug}`;
    const matchedRsvp = rsvpMap.get(guest.guestName.toLowerCase().trim());

    let rsvpStatus = 'Belum Konfirmasi';
    let pax = '-';
    let notes = '';

    if (matchedRsvp) {
      rsvpStatus =
        matchedRsvp.status === 'ATTENDING'
          ? 'Hadir'
          : matchedRsvp.status === 'NOT_ATTENDING'
          ? 'Tidak Hadir'
          : 'Ragu-ragu';
      pax = matchedRsvp.status === 'ATTENDING' ? String(matchedRsvp.pax) : '0';
      notes = matchedRsvp.notes || '';
    }

    const checkInStatus = guest.hasOpened ? 'Sudah Hadir' : 'Belum Check-In';

    return [
      index + 1,
      guest.guestName,
      guest.category,
      guest.whatsappNumber || '-',
      rsvpStatus,
      pax,
      notes,
      guestUrl,
      checkInStatus,
    ];
  });

  const cleanTitle = invitationTitle.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsv(`rekap_tamu_${cleanTitle}_${dateStr}.csv`, headers, rows);
}

/**
 * Exports RSVP confirmation entries to CSV
 */
export function exportRsvpsToCsv(invitationTitle: string, rsvps: RsvpEntry[]): void {
  const headers = ['No', 'Nama Tamu', 'Konfirmasi Kehadiran', 'Jumlah Tamu (Pax)', 'Pesan / Catatan', 'Waktu Konfirmasi'];

  const rows = rsvps.map((r, index) => {
    const statusText =
      r.status === 'ATTENDING' ? 'Hadir' : r.status === 'NOT_ATTENDING' ? 'Tidak Hadir' : 'Tentatif';
    return [index + 1, r.guestName, statusText, r.pax, r.notes || '-', r.createdAt];
  });

  const cleanTitle = invitationTitle.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCsv(`rekap_rsvp_${cleanTitle}_${dateStr}.csv`, headers, rows);
}
