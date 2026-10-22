/** Shared demo state reflected in the authored copy across adjacent screens. */
export function demoText(value: string, id: string, data: {
  city: string;
  booking: {count:number;subtotal:number;summary:string;seats:string[];section:string;promo:boolean};
  form: Record<string,Record<string,string>>;
}) {
  let text=value;
  if(id==='C1' && text.trim()==='Colombo') return data.city;
  const profile=data.form.E7 || {};
  if(id==='E2') {
    if(text==='Ramesh Ram') return `${profile.afirst || 'Ramesh'} ${profile.alast || 'Ram'}`;
    if(text==='ramesh@example.com') return profile.aemail || text;
    if(text==='RR') return `${(profile.afirst || 'Ramesh')[0]}${(profile.alast || 'Ram')[0]}`.toUpperCase();
  }
  if(['D3','D4','D5','D6','D7'].includes(id)) {
    const b=data.booking;
    text=text.replace('2 × Gold',b.summary).replace('G5, G6',b.seats.join(', ')).replace('Gold Centre',b.section);
    text=text.replace('2 seats to pick',`${b.count} seats to pick`).replace('Pick 2 seats',`Pick ${b.count} seats`);
    text=text.replace('Ticket 1 of 2',`Ticket 1 of ${b.count}`);
    if(text==='G5') text=b.seats[0] || '—';
    if(['D5','D6'].includes(id) && text==='LKR 10,000') text=`LKR ${b.subtotal.toLocaleString('en-US')}`;
    if(text==='LKR 10,300') text=`LKR ${(b.subtotal+300-(b.promo?1000:0)).toLocaleString('en-US')}`;
    if(text.startsWith("Booking confirmed. We've emailed")) text=`Demo booking confirmed. Your ${b.count} tickets are ready to preview. No email was sent.`;
    if(text==='SS-2410-[BOOKING ID]') text='SS-DEMO-2410';
    if(text==='Paid · Card •••• [last 4]') text='Demo payment · No charge';
    if(text==='Show this code at the gate. Brightness up helps.') text='Demo ticket preview. This code cannot be used for entry.';
  }
  return text;
}
