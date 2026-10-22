/** Explicit destinations replace the original cross-board artifact URLs. */
export const fileRoutes: Record<string, string> = {
  SplashLoad:'A2', Login:'A3', Register:'A4', Register2:'A5', Onboard1:'B1', Onboard2:'B2', Onboard3:'B3',
  Home:'C1', Categories:'C2', Category:'C3', Organisers:'C4', Organiser:'C5', Search:'C6', Results:'C7', Filters:'C8',
  Event:'D1', TicketSelect:'D2', Section:'D3', Seats:'D4', Checkout:'D5', Confirm:'D6', Ticket:'D7',
  Venue:'E1', Profile:'E2', Bookings:'E3', Saved:'E4', Payment:'E5', Payments:'E5', Notifications:'E6', Account:'E7', Security:'E8',
  Promos:'F1', PromoDetail:'F2', ForgotPw:'G1', Otp:'G2', ResetPw:'G3', ChangePw:'G4', LocationPerm:'G5', CityPicker:'G6', PushPerm:'G7',
  Postponed:'I8', Inbox:'H1', Map:'H2', NoResults:'H3', DatePicker:'H4', Venues:'H5', Processing:'I3', BookingDetail:'J1', Transfer:'J2', Refund:'J3', GateMode:'J4', Help:'J5', Contact:'J6', Legal:'J7', Terms:'J7', BecomeOrganiser:'J8', SignOut:'J9', DeleteAccount:'J10',
  PastBooking:'L6', RateEvent:'L5', Following:'L10', PhotoPicker:'L11', AddCard:'L3',
};

export function destination(screen: string, href: string, label: string): string | undefined {
  const text = label.trim().toLowerCase();
  if (screen === 'A3' && text === 'sign in') return 'C1';
  if (text === 'back' || /^(back to|close|dismiss|cancel$|keep my account)/.test(text)) return 'back';
  if (/change city|^colombo$/.test(text)) return 'G6';
  if (/notification settings/.test(text)) return 'E6';
  if (/^notifications[, ]/.test(text)) return 'H1';
  const names: Record<string,string> = {
    home:'C1', explore:'C2', categories:'C2', organisers:'C4', venues:'H5', promotions:'F1', profile:'E2',
    'map view':'H2', 'list view':'C7', 'filters':'C8', 'any date':'H4', 'price':'C8', 'distance':'C8',
    'forgot password?':'G1', 'sign in':'A3', 'sign in with email':'A3', 'sign up':'A4', 'create an account':'A4',
    'become an organiser':'J8', 'for organisers':'J8', 'help':'J5', 'terms':'J7', 'privacy':'J7', 'privacy policy':'J7', 'refund policy':'J7',
    'view venue':'E1', 'venue & directions':'E1', 'directions':'H2', 'get directions':'H2', 'open in maps':'H2',
    'add a new card':'L3', 'change photo':'L11', 'delete my account': screen === 'J10' ? 'A3' : 'J10',
    'sign out': screen === 'J9' ? 'A3' : 'J9', 'send ticket 2':'J2', 'send':'J2', 'view tickets':'J1',
    'open my tickets':'E3', 'show my tickets':'E3', 'show my saved tickets':'J4', 'show qr':'J4',
    'continue as guest':'D5', 'pick seats again':'D4', 'back to event':'D1', 'keep my tickets':'J1',
    'request a refund':'J3', 'choose tickets':'D2', 'save card':'E5', 'find events':'C1',
    'browse organisers':'C4', 'follow organisers for updates':'C4', 'search venues':'C6',
    'see your available codes →':'F1', 'view my pass':'D7', 'wrong email?':'A4', 'verify & continue':'G5',
    'allow location':'G6', 'turn on notifications':'C1', 'not now':'C1', 'open in the app':'D1', 'buy tickets on the web':'D2',
    'clear filters':'C7', 'search this area':'C7', 'use another method':'D5', 'get tickets with this code':'D2',
  };
  if (names[text]) return names[text];
  if (screen === 'D5' && /^pay /.test(text)) return 'I3';
  if (screen === 'L4' && /^pay /.test(text)) return 'I3';
  if (screen === 'G3' && /save/.test(text)) return 'A3';
  if (screen === 'A5' && /create account/.test(text)) return 'L2';
  if (screen === 'G6' && /show events/.test(text)) return 'G7';
  if (screen === 'F2' && /tamil fest/.test(text)) return 'D1';
  if (/edit search/.test(text)) return 'C6';
  if (/browse events|back to home/.test(text)) return 'C1';
  if (/^search (categories|organisers)/.test(text)) return 'C6';
  if (/see other events/.test(text)) return 'C5';
  if (screen === 'H4' && /apply|show/.test(text)) return 'C7';
  if (screen === 'I1' && /checkout/.test(text)) return 'D5';
  if (screen === 'I9' && /guest/.test(text)) return 'D5';
  if (screen === 'K1' && text === 'try again') return 'C1';
  const file = href.match(/([^/]+)\.dc\.html/);
  if (file) return fileRoutes[file[1]];
  // Cross-board links in the source all shared four artifact URLs. Resolve by role and context.
  if (href.startsWith('https://claude.ai/artifact/')) {
    if (screen === 'E1') return /see all/.test(text) ? 'C3' : 'D1';
    if (['E4','F1','H3','L6'].includes(screen)) return 'D1';
    if (screen === 'H5' || (screen === 'C7' && /theatre|hall|park/.test(text))) return 'E1';
    if (screen === 'H2') return 'D1';
    if (screen === 'E3') return 'J1';
    if (screen === 'J1') return 'D1';
    if (screen === 'L1') return 'D2';
    if (screen === 'L5') return 'C5';
    if (screen === 'H3') return 'C7';
  }
  return undefined;
}
