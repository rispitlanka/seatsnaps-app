// Generated from the supplied design Component classes. No runtime eval.
import { DesignLogic } from "../model";

class A1 extends DesignLogic {
  renderVals() { return {}; }
}

class A2 extends DesignLogic {
  renderVals() { return {}; }
}

class A3 extends DesignLogic {
  renderVals() {
    var self = this;
    var show = !!this.state.showPw;
    return {
      pwType: show ? 'text' : 'password',
      pwLabel: show ? 'Hide password' : 'Show password',
      togglePw: function () { self.setState({ showPw: !show }); }
    };
  }
}

class A4 extends DesignLogic {
  renderVals() { return {}; }
}

class A5 extends DesignLogic {
  renderVals() {
    var self = this;
    var show = !!this.state.showPw;
    var pw = this.state.pw || '';
    var score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    var color = score <= 1 ? '#D64545' : (score === 2 ? '#C77A00' : '#2F5BFF');
    function bar(i) { return 'height: 4px; border-radius: 999px; background: ' + (pw && i <= score ? color : '#E3E7F1') + ';'; }
    var words = ['Too short', 'Weak', 'Okay', 'Strong', 'Very strong'];
    return {
      pwType: show ? 'text' : 'password',
      pwLabel: show ? 'Hide password' : 'Show password',
      togglePw: function () { self.setState({ showPw: !show }); },
      onPw: function (e) { self.setState({ pw: e.target.value }); },
      bar1: bar(1), bar2: bar(2), bar3: bar(3), bar4: bar(4),
      strengthText: pw ? words[score] : 'Use 8+ characters with a number and a symbol.'
    };
  }
}

class B1 extends DesignLogic {
  renderVals() { return {}; }
}

class B2 extends DesignLogic {
  renderVals() {
    var taken = [1, 2, 5, 9, 15, 20, 26, 27, 33];
    var mine = [16, 17];
    var seats = [];
    for (var i = 0; i < 35; i++) {
      var bg = mine.indexOf(i) !== -1 ? 'background: #2F5BFF;' : (taken.indexOf(i) !== -1 ? 'background: #D5DAE6;' : 'background: #FFFFFF; border: 1.5px solid #B9C4E4;');
      seats.push({ style: 'width: 26px; height: 26px; border-radius: 7px; box-sizing: border-box; display: block; ' + bg });
    }
    return { seats: seats };
  }
}

class B3 extends DesignLogic {
  renderVals() {
    var n = 15, cells = [], seed = 11;
    function finder(r, c) {
      var corners = [[0,0],[0,n-7],[n-7,0]];
      for (var i = 0; i < 3; i++) {
        var y = r - corners[i][0], x = c - corners[i][1];
        if (y >= 0 && y < 7 && x >= 0 && x < 7) {
          return (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) ? 1 : 0;
        }
        if (y >= -1 && y <= 7 && x >= -1 && x <= 7) return 0;
      }
      return -1;
    }
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        var f = finder(r, c), on;
        if (f !== -1) { on = f === 1; } else { seed = (seed * 9301 + 49297) % 233280; on = seed / 233280 > 0.5; }
        cells.push({ style: 'display: block; width: 100%; aspect-ratio: 1; background: ' + (on ? '#0A1130' : 'transparent') + ';' });
      }
    }
    return { qr: cells };
  }
}

class B4 extends DesignLogic {
  renderVals() { return {}; }
}

class C1 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    function av(bg, fg) { return 'width: 64px; height: 64px; border-radius: 999px; background: ' + bg + '; color: ' + fg + '; font-size: 20px; font-weight: 800; display: flex; align-items: center; justify-content: center'; }
    return {
      featured: [
        { img: B + '38d8301699fbd525716d5ddf2cd98a11', alt: 'Festival crowd under bunting', mon: 'OCT', day: '24', cat: 'Festival', name: 'Tamil Fest 2026', meta: 'Nelum Pokuna · 7:30 PM', price: 'From LKR 5,000' },
        { img: B + '91bf1841d4c8406abbd784267d171479', alt: 'Concert crowd', mon: 'OCT', day: '30', cat: 'Concert', name: 'Colombo Jazz Nights', meta: 'Galle Face · 8:00 PM', price: 'From LKR 4,500' }
      ],
      weekend: [
        { img: B + 'be55be5a266eff72addd53c16a5d112b', date: 'SAT 17', name: 'Stand-up Saturdays', meta: 'Colombo 03 · 8:00 PM', price: 'LKR 2,000' },
        { img: B + 'bd7dc1449b1f824e5dc30205fbff2f77', date: 'SAT 17', name: 'Board Game Hangout 6', meta: 'Colombo 07 · 4:00 PM', price: 'Free' },
        { img: B + 'f1f81e751b97d500437d51ca82299234', date: 'SUN 18', name: 'Scarborough Folk Fest', meta: 'Viharamahadevi Park', price: 'LKR 2,500' }
      ],
      orgs: [
        { initials: 'PL', name: 'Pulse Live LK', meta: '8 upcoming', avatar: av('#2F5BFF', '#FFFFFF') },
        { initials: 'TA', name: 'Tamil Arts Circle', meta: '3 upcoming', avatar: av('#0A1130', '#FFFFFF') },
        { initials: 'CC', name: 'Colombo Comedy Co.', meta: '5 upcoming', avatar: av('#EAF0FF', '#1E40C8') }
      ],
      near: [
        { img: B + 'e1eb3776c653bdbf1992ac3e94d7cb67', date: 'Sat 7 Nov · 6:30 PM', name: 'Colombo Derby Night', meta: 'Sugathadasa Stadium', price: 'LKR 1,500', dist: '2.4 km' },
        { img: B + '75c35a92ae5359f8b42a69b932c7590a', date: 'Fri 30 Oct · 8:00 PM', name: 'Colombo Jazz Nights', meta: 'Galle Face', price: 'LKR 4,500', dist: '3.1 km' },
        { img: B + '3fec09965edaaddb40a4fab0940dad5b', date: 'Thu 12 Nov · 9:00 AM', name: 'Nexus Career Fair', meta: 'BMICH, Colombo 07', price: 'Free', dist: '4.8 km' }
      ]
    };
  }
}

class C2 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    return {
      cats: [
        { name: 'Concerts', count: '24 events', img: B + '75c35a92ae5359f8b42a69b932c7590a' },
        { name: 'Festivals', count: '9 events', img: B + 'f1f81e751b97d500437d51ca82299234' },
        { name: 'Comedy', count: '7 events', img: B + 'be55be5a266eff72addd53c16a5d112b' },
        { name: 'Sports', count: '15 events', img: B + 'e1eb3776c653bdbf1992ac3e94d7cb67' },
        { name: 'Meetups', count: '18 events', img: B + 'bd7dc1449b1f824e5dc30205fbff2f77' },
        { name: 'Careers & expos', count: '6 events', img: B + '3fec09965edaaddb40a4fab0940dad5b' },
        { name: 'Live music', count: '12 events', img: B + '91bf1841d4c8406abbd784267d171479' },
        { name: 'Cultural', count: '11 events', img: B + '38d8301699fbd525716d5ddf2cd98a11' }
      ]
    };
  }
}

class C3 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    var fast = '#C2410C', ok = '#5B6478';
    return {
      events: [
        { img: B + '75c35a92ae5359f8b42a69b932c7590a', mon: 'OCT', day: '17', name: 'Indie Night Live', meta: 'Sat · 7:00 PM · Colombo 03', org: 'Pulse Live LK', price: 'LKR 3,000', tag: 'Selling fast', tagColor: fast },
        { img: B + '91bf1841d4c8406abbd784267d171479', mon: 'OCT', day: '18', name: 'Sunday Sessions', meta: 'Sun · 5:30 PM · Mount Lavinia', org: 'Island Sound Co.', price: 'LKR 2,500', tag: '', tagColor: ok },
        { img: B + '38d8301699fbd525716d5ddf2cd98a11', mon: 'OCT', day: '18', name: 'Baila Beats Open Air', meta: 'Sun · 6:00 PM · Galle Face', org: 'Pulse Live LK', price: 'LKR 1,500', tag: '40 seats left', tagColor: fast },
        { img: B + '75c35a92ae5359f8b42a69b932c7590a', mon: 'OCT', day: '18', name: 'Acoustic Rooftop', meta: 'Sun · 8:00 PM · Colombo 02', org: 'Island Sound Co.', price: 'LKR 4,000', tag: '', tagColor: ok },
        { img: B + '91bf1841d4c8406abbd784267d171479', mon: 'OCT', day: '17', name: 'Tamil Classics Unplugged', meta: 'Sat · 6:30 PM · Wellawatte', org: 'Tamil Arts Circle', price: 'LKR 2,000', tag: '', tagColor: ok },
        { img: B + 'f1f81e751b97d500437d51ca82299234', mon: 'OCT', day: '17', name: 'DJ Night on the Lake', meta: 'Sat · 9:00 PM · Beira Lake', org: 'Pulse Live LK', price: 'LKR 4,500', tag: 'Selling fast', tagColor: fast }
      ]
    };
  }
}

class C4 extends DesignLogic {
  renderVals() {
    function av(bg, fg) { return 'width: 52px; height: 52px; border-radius: 999px; background: ' + bg + '; color: ' + fg + '; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0'; }
    var follow = 'height: 36px; padding: 0 16px; border-radius: 999px; background: #2F5BFF; color: #FFFFFF; font-size: 13px; font-weight: 800; display: flex; align-items: center; flex-shrink: 0';
    var following = 'height: 36px; padding: 0 14px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E3E7F1; box-sizing: border-box; color: #0A1130; font-size: 13px; font-weight: 700; display: flex; align-items: center; flex-shrink: 0';
    return {
      orgs: [
        { initials: 'TA', name: 'Tamil Arts Circle', verified: true, meta: 'Festivals · 3 upcoming', avatar: av('#0A1130', '#FFFFFF'), btn: 'Following', btnStyle: following },
        { initials: 'CC', name: 'Colombo Comedy Co.', verified: true, meta: 'Comedy · 5 upcoming', avatar: av('#EAF0FF', '#1E40C8'), btn: 'Follow', btnStyle: follow },
        { initials: 'IS', name: 'Island Sound Co.', verified: false, meta: 'Concerts · 4 upcoming', avatar: av('#2F5BFF', '#FFFFFF'), btn: 'Follow', btnStyle: follow },
        { initials: 'DB', name: 'Dice & Brews', verified: false, meta: 'Meetups · 2 upcoming', avatar: av('#1A2558', '#FFFFFF'), btn: 'Follow', btnStyle: follow },
        { initials: 'NC', name: 'Nexus Careers', verified: true, meta: 'Expos · 1 upcoming', avatar: av('#EAF0FF', '#1E40C8'), btn: 'Follow', btnStyle: follow }
      ]
    };
  }
}

class C5 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    return {
      events: [
        { img: B + '75c35a92ae5359f8b42a69b932c7590a', date: 'Sat 17 Oct · 7:00 PM', name: 'Indie Night Live', venue: 'Colombo 03', price: 'LKR 3,000' },
        { img: B + '38d8301699fbd525716d5ddf2cd98a11', date: 'Sun 18 Oct · 6:00 PM', name: 'Baila Beats Open Air', venue: 'Galle Face Green', price: 'LKR 1,500' },
        { img: B + 'f1f81e751b97d500437d51ca82299234', date: 'Sat 17 Oct · 9:00 PM', name: 'DJ Night on the Lake', venue: 'Beira Lake', price: 'LKR 4,500' },
        { img: B + '91bf1841d4c8406abbd784267d171479', date: 'Fri 30 Oct · 8:00 PM', name: 'Colombo Jazz Nights', venue: 'Galle Face', price: 'LKR 4,500' }
      ]
    };
  }
}

class C6 extends DesignLogic {
  renderVals() {
    return {
      recent: ['jazz', 'Tamil Fest', 'comedy this weekend'],
      trending: [
        { n: '1', q: 'Colombo Jazz Nights', cat: 'Concert · Fri 30 Oct' },
        { n: '2', q: 'Colombo Derby Night', cat: 'Sports · Sat 7 Nov' },
        { n: '3', q: 'Stand-up Saturdays', cat: 'Comedy · Every Saturday' },
        { n: '4', q: 'Halloween parties', cat: 'Search term' }
      ]
    };
  }
}

class C7 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    return {
      events: [
        { img: B + '75c35a92ae5359f8b42a69b932c7590a', date: 'Sat 17 Oct · 9:00 PM', name: 'Late-Night Jazz Lounge', venue: 'Colombo 02', price: 'LKR 3,500' },
        { img: B + 'be55be5a266eff72addd53c16a5d112b', date: 'Thu 22 Oct · 7:30 PM', name: 'Jazz & Poetry Evening', venue: 'Colombo 07', price: 'LKR 1,500' },
        { img: B + '38d8301699fbd525716d5ddf2cd98a11', date: 'Sun 1 Nov · 5:00 PM', name: 'Sunset Jazz on the Green', venue: 'Galle Face Green', price: 'Free' }
      ],
      venues: [
        { name: 'The Jazz Room', meta: 'Colombo 03 · 2 events this month' },
        { name: 'Galle Face Green', meta: 'Colombo 01 · 6 events this month' }
      ]
    };
  }
}

class C8 extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { date: 'This weekend', cats: ['Concerts'], price: 'Under 5k', dist: '10 km' };
  }
  renderVals() {
    var self = this, s = this.state;
    var chipOn = 'all: unset; cursor: pointer; height: 40px; padding: 0 16px; border-radius: 999px; background: #0A1130; color: #FFFFFF; font-size: 14px; font-weight: 700; display: flex; align-items: center; box-sizing: border-box';
    var chipOff = 'all: unset; cursor: pointer; height: 40px; padding: 0 16px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E3E7F1; color: #0A1130; font-size: 14px; font-weight: 600; display: flex; align-items: center; box-sizing: border-box';
    var segOn = 'all: unset; cursor: pointer; height: 44px; border-radius: 12px; background: #FFFFFF; color: #0A1130; font-size: 13px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(10,17,48,0.1)';
    var segOff = 'all: unset; cursor: pointer; height: 44px; border-radius: 12px; color: #4A5368; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center';
    function single(key, labels) {
      return labels.map(function (l) {
        var on = s[key] === l;
        return { label: l, on: on, style: on ? chipOn : chipOff, seg: on ? segOn : segOff, pick: function () { var o = {}; o[key] = l; self.setState(o); } };
      });
    }
    var cats = ['Concerts', 'Festivals', 'Comedy', 'Sports', 'Meetups', 'Expos'].map(function (l) {
      var on = s.cats.indexOf(l) !== -1;
      return { label: l, on: on, style: on ? chipOn : chipOff, pick: function () {
        self.setState({ cats: on ? s.cats.filter(function (x) { return x !== l; }) : s.cats.concat([l]) });
      } };
    });
    var active = (s.date !== 'Any time' ? 1 : 0) + s.cats.length + (s.price !== 'Any' ? 1 : 0) + (s.dist !== 'Any' ? 1 : 0);
    return {
      dates: single('date', ['Any time', 'Today', 'Tomorrow', 'This weekend', 'Pick dates']),
      cats: cats,
      prices: single('price', ['Any', 'Free', 'Under 5k', '5k+']),
      dists: single('dist', ['Any', '5 km', '10 km', '25 km']),
      distLabel: s.dist === 'Any' ? 'Anywhere' : 'Within ' + s.dist,
      cta: active ? 'Show results · ' + active + ' filters' : 'Show all results',
      reset: function () { self.setState({ date: 'Any time', cats: [], price: 'Any', dist: 'Any' }); }
    };
  }
}

class D1 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    function tier(name, price, avail, color, dot, last) {
      return {
        name: name, price: price, avail: avail, availColor: color,
        dot: 'width: 12px; height: 12px; border-radius: 4px; flex-shrink: 0; background: ' + dot,
        rowStyle: 'display: flex; align-items: center; gap: 12px; padding: 14px 16px;' + (last ? '' : ' border-bottom: 1px solid #EEF1F7;')
      };
    }
    return {
      tiers: [
        tier('VIP', 'LKR 8,000', 'Only 12 left', '#C2410C', '#0A1130', false),
        tier('Gold', 'LKR 5,000', 'Available', '#5B6478', '#2F5BFF', false),
        tier('Silver', 'LKR 3,000', 'Available', '#5B6478', '#9DB3FF', false),
        tier('Balcony', 'LKR 2,000', 'Available', '#5B6478', '#DCE4FF', true)
      ],
      facts: [
        { k: 'Age', v: 'All ages' },
        { k: 'Duration', v: '3 hrs 30 mins' },
        { k: 'Parking', v: 'On-site, free' },
        { k: 'Refunds', v: 'Up to 48 hrs before' }
      ],
      more: [
        { img: B + 'f1f81e751b97d500437d51ca82299234', date: 'Sun 18 Oct', name: 'Scarborough Folk Fest', price: 'LKR 2,500' },
        { img: B + '3fec09965edaaddb40a4fab0940dad5b', date: 'Sat 31 Oct', name: 'Colombo Food Fair', price: 'From LKR 750' },
        { img: B + '91bf1841d4c8406abbd784267d171479', date: 'Sat 14 Nov', name: 'Deepavali Nights', price: 'LKR 1,500' }
      ]
    };
  }
}

class D2 extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { q: { VIP: 0, Gold: 2, Silver: 0, Balcony: 0 } };
  }
  renderVals() {
    var self = this, q = this.state.q;
    var defs = [
      { name: 'VIP', price: 8000, perk: 'Front rows · welcome drink', avail: 'Only 12 left', fast: true, dot: '#0A1130' },
      { name: 'Gold', price: 5000, perk: 'Rows E–J · centre view', avail: 'Available', fast: false, dot: '#2F5BFF' },
      { name: 'Silver', price: 3000, perk: 'Rows K–R', avail: 'Available', fast: false, dot: '#9DB3FF' },
      { name: 'Balcony', price: 2000, perk: 'Upper level', avail: 'Available', fast: false, dot: '#DCE4FF' }
    ];
    var count = 0, sum = 0, picked = [];
    defs.forEach(function (d) { count += q[d.name]; sum += q[d.name] * d.price; if (q[d.name]) picked.push(q[d.name] + ' × ' + d.name); });
    function fmt(n) { return 'LKR ' + n.toLocaleString('en-US'); }
    function set(name, v) { var n = Object.assign({}, q); n[name] = v; self.setState({ q: n }); }
    var tiers = defs.map(function (d) {
      var qty = q[d.name], on = qty > 0;
      return {
        name: d.name, priceLabel: fmt(d.price), perk: d.perk, avail: d.avail, availColor: d.fast ? '#C2410C' : '#5B6478', qty: qty,
        dot: 'width: 12px; height: 40px; border-radius: 6px; flex-shrink: 0; background: ' + d.dot,
        card: 'display: flex; align-items: center; gap: 12px; padding: 14px; background: #FFFFFF; border-radius: 18px; box-sizing: border-box; border: ' + (on ? '2px solid #2F5BFF' : '1px solid #E3E7F1'),
        minusStyle: 'all: unset; cursor: pointer; width: 40px; height: 40px; border-radius: 999px; border: 1px solid #E3E7F1; box-sizing: border-box; display: flex; align-items: center; justify-content: center; color: ' + (qty ? '#0A1130' : '#B9C1D3'),
        minusLabel: 'Remove one ' + d.name + ' ticket', plusLabel: 'Add one ' + d.name + ' ticket',
        minus: function () { if (qty > 0) set(d.name, qty - 1); },
        plus: function () { if (count < 6) set(d.name, qty + 1); }
      };
    });
    var on = count > 0;
    return {
      tiers: tiers,
      summary: on ? picked.join(', ') : 'No tickets yet',
      total: fmt(sum),
      cta: 'height: 54px; border-radius: 999px; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; text-decoration: none; background: ' + (on ? '#2F5BFF' : '#B9C1D3') + (on ? '' : '; pointer-events: none')
    };
  }
}

class D3 extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { sel: 'Gold Centre' };
  }
  renderVals() {
    var self = this, sel = this.state.sel;
    var blocks = [
      { name: 'Gold Left', left: '9 left', note: 'Side view · aisle seats' },
      { name: 'Gold Centre', left: '18 left', note: 'Best view of the stage' },
      { name: 'Gold Right', left: '6 left', note: 'Side view · near exit' }
    ];
    var cur = blocks.filter(function (b) { return b.name === sel; })[0];
    return {
      gold: blocks.map(function (b) {
        var on = b.name === sel;
        return {
          name: b.name.replace('Gold ', ''), left: b.left, on: on,
          pick: function () { self.setState({ sel: b.name }); },
          style: 'all: unset; cursor: pointer; height: 76px; border-radius: 12px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; ' + (on ? 'background: #2F5BFF; color: #FFFFFF;' : 'background: #FFFFFF; color: #1E40C8; border: 1.5px solid #2F5BFF;')
        };
      }),
      selName: cur.name,
      selNote: cur.note + ' · LKR 5,000 each'
    };
  }
}

class D4 extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { picked: ['G5', 'G6'] };
  }
  renderVals() {
    var self = this, picked = this.state.picked || [];
    var need = this.context.count || 2;
    var taken = ['E1','E2','E9','F4','F5','F6','G1','G10','H3','H7','H8','I5','I6','J1','J2','J9','J10'];
    function seat(r, n) {
      var id = r + n, isT = taken.indexOf(id) !== -1, mine = picked.indexOf(id) !== -1;
      var look = isT ? 'background: #D5DAE6; color: transparent; cursor: not-allowed;' : (mine ? 'background: #2F5BFF; color: #FFFFFF;' : 'background: #FFFFFF; color: #7A8398; border: 1.5px solid #B9C4E4;');
      return {
        num: n, taken: isT,
        aria: 'Seat ' + id + (isT ? ', taken' : (mine ? ', selected' : '')),
        style: 'all: unset; cursor: pointer; width: 26px; height: 26px; border-radius: 8px; box-sizing: border-box; font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; ' + look,
        pick: function () {
          if (isT) return;
          var next;
          if (mine) next = picked.filter(function (p) { return p !== id; });
          else next = (picked.length >= need ? picked.slice(1) : picked).concat([id]);
          self.setState({ picked: next });
        }
      };
    }
    var rows = ['E','F','G','H','I','J'].map(function (r) {
      return { label: r, left: [1,2,3,4,5].map(function (n) { return seat(r, n); }), right: [6,7,8,9,10].map(function (n) { return seat(r, n); }) };
    });
    var done = picked.length === need;
    var sorted = picked.slice().sort();
    return {
      rows: rows,
      chips: sorted.map(function (p) { return 'Seat ' + p; }),
      none: picked.length === 0,
      total: 'LKR ' + (picked.length * ((this.context.subtotal || 10000) / need)).toLocaleString('en-US'),
      ctaLabel: done ? 'Continue to checkout' : 'Pick ' + (need - picked.length) + ' more seat' + (need - picked.length === 1 ? '' : 's'),
      cta: 'height: 54px; border-radius: 999px; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; text-decoration: none; background: ' + (done ? '#2F5BFF' : '#B9C1D3') + (done ? '' : '; pointer-events: none')
    };
  }
}

class D5 extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { method: 'card', promo: false };
  }
  renderVals() {
    var self = this, s = this.state;
    var defs = [
      { id: 'card', name: 'Credit or debit card', note: 'Visa, Mastercard, Amex' },
      { id: 'wallet', name: 'Mobile wallet', note: 'Pay from your phone wallet' },
      { id: 'bank', name: 'Online banking', note: 'Pay from your bank account' }
    ];
    var total = (this.context.subtotal ?? 10000) + 300 - (s.promo ? 1000 : 0);
    return {
      methods: defs.map(function (d) {
        var on = s.method === d.id;
        return {
          name: d.name, note: d.note, on: on,
          pick: function () { self.setState({ method: d.id }); },
          card: 'all: unset; cursor: pointer; display: flex; align-items: center; gap: 12px; padding: 14px; background: #FFFFFF; border-radius: 16px; box-sizing: border-box; border: ' + (on ? '2px solid #2F5BFF' : '1px solid #E3E7F1'),
          radio: 'width: 20px; height: 20px; border-radius: 999px; box-sizing: border-box; flex-shrink: 0; ' + (on ? 'border: 6px solid #2F5BFF; background: #FFFFFF' : 'border: 2px solid #B9C1D3')
        };
      }),
      isCard: s.method === 'card',
      promoOn: s.promo,
      promoBtn: s.promo ? 'Remove' : 'Apply',
      applyPromo: function () { self.setState({ promo: !s.promo }); },
      total: 'LKR ' + total.toLocaleString('en-US')
    };
  }
}

class D6 extends DesignLogic {
  renderVals() {
    var n = 17, cells = [], seed = 5;
    function finder(r, c) {
      var corners = [[0,0],[0,n-7],[n-7,0]];
      for (var i = 0; i < 3; i++) {
        var y = r - corners[i][0], x = c - corners[i][1];
        if (y >= 0 && y < 7 && x >= 0 && x < 7) return (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) ? 1 : 0;
        if (y >= -1 && y <= 7 && x >= -1 && x <= 7) return 0;
      }
      return -1;
    }
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        var f = finder(r, c), on;
        if (f !== -1) { on = f === 1; } else { seed = (seed * 9301 + 49297) % 233280; on = seed / 233280 > 0.5; }
        cells.push({ style: 'display: block; width: 100%; aspect-ratio: 1; background: ' + (on ? '#0A1130' : 'transparent') + ';' });
      }
    }
    return { qr: cells };
  }
}

class D7 extends DesignLogic {
  renderVals() {
    var n = 17, cells = [], seed = 7;
    function finder(r, c) {
      var corners = [[0,0],[0,n-7],[n-7,0]];
      for (var i = 0; i < 3; i++) {
        var y = r - corners[i][0], x = c - corners[i][1];
        if (y >= 0 && y < 7 && x >= 0 && x < 7) {
          var edge = y === 0 || y === 6 || x === 0 || x === 6;
          var core = y >= 2 && y <= 4 && x >= 2 && x <= 4;
          return edge || core ? 1 : 0;
        }
        if (y >= -1 && y <= 7 && x >= -1 && x <= 7) return 0;
      }
      return -1;
    }
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        var f = finder(r, c);
        var on;
        if (f !== -1) { on = f === 1; }
        else { seed = (seed * 9301 + 49297) % 233280; on = seed / 233280 > 0.52; }
        cells.push({ style: 'width: 100%; aspect-ratio: 1; background: ' + (on ? '#0A1130' : 'transparent') + ';' });
      }
    }
    return { qr: cells };
  }
}

class E1 extends DesignLogic {
  renderVals() {
    return {
      events: [
        { mon: 'OCT', day: '24', name: 'Tamil Fest 2026', meta: 'Sat · 7:30 PM · Festival', price: 'LKR 2,000+' },
        { mon: 'NOV', day: '06', name: 'Symphony Under Lights', meta: 'Fri · 7:00 PM · Concert', price: 'LKR 3,500+' },
        { mon: 'NOV', day: '14', name: 'Deepavali Nights', meta: 'Sat · 6:30 PM · Cultural', price: 'LKR 1,500+' }
      ],
      facilities: ['Free parking', 'Wheelchair access', 'Air-conditioned', 'Café & snacks', 'Cloakroom', 'Card payments']
    };
  }
}

class E2 extends DesignLogic {
  renderVals() {
    function row(last) { return 'display: flex; align-items: center; gap: 12px; padding: 12px 10px; text-decoration: none; color: #0A1130;' + (last ? '' : ' border-bottom: 1px solid #EEF1F7;'); }
    return {
      group1: [
        { href: 'Bookings.dc.html', label: 'My tickets & bookings', sub: '2 upcoming · 3 tickets', isTicket: true, row: row(false) },
        { href: 'Saved.dc.html', label: 'Saved events', sub: '3 saved', isHeart: true, row: row(false) },
        { href: 'Following.dc.html', label: 'Following', sub: '3 organisers · 2 venues', isUsers: true, row: row(false) },
        { href: 'Payments.dc.html', label: 'Payment methods', sub: '1 card saved', isCard: true, row: row(false) },
        { href: 'NotifSettings.dc.html', label: 'Notifications', sub: 'Enabled', isBell: true, row: row(true) }
      ],
      group2: [
        { href: 'Account.dc.html', label: 'Account settings', sub: 'Name, email, city', isGear: true, row: row(false) },
        { href: 'Security.dc.html', label: 'Security', sub: 'Password, sign-in', isShield: true, row: row(false) },
        { href: 'Help.dc.html', label: 'Help & support', sub: 'FAQ, contact us', isHelp: true, row: row(false) },
        { href: 'BecomeOrganiser.dc.html', label: 'Become an organiser', sub: 'Sell tickets on SeatSnaps', isMic: true, row: row(true) }
      ]
    };
  }
}

class E3 extends DesignLogic {
  constructor(props) { super(props); this.state = { tab: 'up' }; }
  renderVals() {
    var self = this, up = this.state.tab === 'up';
    var on = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; background: #FFFFFF; color: #0A1130; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(10,17,48,0.08)';
    var off = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; color: #4A5368; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center';
    return {
      isUp: up, isPast: !up,
      tabUp: up ? on : off, tabPast: up ? off : on,
      showUp: function () { self.setState({ tab: 'up' }); },
      showPast: function () { self.setState({ tab: 'past' }); }
    };
  }
}

class E4 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    return {
      items: [
        { img: B + '91bf1841d4c8406abbd784267d171479', date: 'Fri 30 Oct · 8:00 PM', name: 'Colombo Jazz Nights', venue: 'Galle Face', price: 'LKR 4,500', tag: 'Selling fast', tagColor: '#C2410C' },
        { img: B + 'e1eb3776c653bdbf1992ac3e94d7cb67', date: 'Sat 7 Nov · 6:30 PM', name: 'Colombo Derby Night', venue: 'Sugathadasa Stadium', price: 'LKR 1,500', tag: 'On sale', tagColor: '#15803D' },
        { img: B + 'be55be5a266eff72addd53c16a5d112b', date: 'Sat 17 Oct · 8:00 PM', name: 'Stand-up Saturdays', venue: 'Colombo 03', price: 'LKR 2,000', tag: 'On sale', tagColor: '#15803D' }
      ]
    };
  }
}

class E5 extends DesignLogic {
  renderVals() { return {}; }
}

class E6 extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { on: { confirm: true, remind: true, changes: true, follow: true, drops: true, promos: false, push: true, email: true, sms: false } };
  }
  renderVals() {
    var self = this, on = this.state.on;
    function item(id, label, sub, locked, last) {
      var v = on[id];
      return {
        label: label, sub: sub, on: v,
        row: 'display: flex; align-items: center; gap: 12px; padding: 12px 0;' + (last ? '' : ' border-bottom: 1px solid #EEF1F7;'),
        track: 'all: unset; cursor: ' + (locked ? 'not-allowed' : 'pointer') + '; width: 50px; height: 30px; border-radius: 999px; box-sizing: border-box; padding: 3px; display: flex; flex-shrink: 0; justify-content: ' + (v ? 'flex-end' : 'flex-start') + '; background: ' + (v ? (locked ? '#9DB3FF' : '#2F5BFF') : '#D5DAE6'),
        knob: 'width: 24px; height: 24px; border-radius: 999px; background: #FFFFFF; box-shadow: 0 1px 3px rgba(10,17,48,0.25)',
        toggle: function () { if (locked) return; var n = Object.assign({}, on); n[id] = !v; self.setState({ on: n }); }
      };
    }
    return {
      groups: [
        { title: 'TICKETS & EVENTS', items: [
          item('confirm', 'Booking confirmations', 'Always on — your tickets live here', true, false),
          item('remind', 'Event reminders', 'A day before and 2 hours before', false, false),
          item('changes', 'Time or venue changes', 'If an organiser updates your event', false, true)
        ] },
        { title: 'DISCOVER', items: [
          item('follow', 'Organisers you follow', 'When they announce new events', false, false),
          item('drops', 'Saved events', 'Low ticket alerts and price changes', false, false),
          item('promos', 'Promotions & offers', 'Promo codes and early-bird deals', false, true)
        ] },
        { title: 'HOW WE REACH YOU', items: [
          item('push', 'Push notifications', 'On this phone', false, false),
          item('email', 'Email', 'ramesh@example.com', false, false),
          item('sms', 'SMS', '+94 77 ••• ••67', false, true)
        ] }
      ]
    };
  }
}

class E7 extends DesignLogic {
  renderVals() { return {}; }
}

class E8 extends DesignLogic {
  constructor(props) { super(props); this.state = { twoFa: false }; }
  renderVals() {
    var self = this, v = this.state.twoFa;
    return {
      twoFa: v,
      twoFaNote: v ? 'On · codes sent by SMS' : 'Off · add a code when you sign in',
      toggle: function () { self.setState({ twoFa: !v }); },
      track: 'all: unset; cursor: pointer; width: 50px; height: 30px; border-radius: 999px; box-sizing: border-box; padding: 3px; display: flex; flex-shrink: 0; justify-content: ' + (v ? 'flex-end' : 'flex-start') + '; background: ' + (v ? '#2F5BFF' : '#D5DAE6')
    };
  }
}

class F1 extends DesignLogic {
  constructor(props) { super(props); this.state = { chip: 'All', copied: '' }; }
  renderVals() {
    var self = this, s = this.state, B = '/_blob/';
    var on = 'all: unset; cursor: pointer; flex-shrink: 0; height: 40px; padding: 0 16px; border-radius: 999px; background: #0A1130; color: #FFFFFF; font-size: 14px; font-weight: 700; display: flex; align-items: center';
    var off = 'all: unset; cursor: pointer; flex-shrink: 0; height: 40px; padding: 0 16px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E3E7F1; box-sizing: border-box; font-size: 14px; font-weight: 600; display: flex; align-items: center';
    var codes = [
      { big: 'LKR', small: '1,000 OFF', bg: '#2F5BFF', fg: '#FFFFFF', title: 'Early bird · Tamil Fest', terms: '2+ Gold or VIP tickets · ends Sun 18 Oct', code: 'EARLYBIRD' },
      { big: '15%', small: 'OFF', bg: '#0A1130', fg: '#FFFFFF', title: 'Your first booking', terms: 'Any event · up to LKR 1,500 off', code: 'FIRSTSNAP' },
      { big: '2+', small: 'COMEDY', bg: '#EAF0FF', fg: '#1E40C8', title: '10% off comedy for groups', terms: '2 or more tickets · comedy events', code: 'LAUGH10' }
    ];
    return {
      chips: ['All', 'Codes', 'Early bird', 'Bundles', 'Partners'].map(function (l) {
        return { label: l, on: s.chip === l, style: s.chip === l ? on : off, pick: function () { self.setState({ chip: l }); } };
      }),
      codes: codes.map(function (c) {
        var done = s.copied === c.code;
        return Object.assign({}, c, {
          btnText: done ? 'Copied' : 'Copy', copyLabel: 'Copy code ' + c.code,
          copy: function () { self.setState({ copied: c.code }); },
          btn: 'all: unset; cursor: pointer; height: 32px; padding: 0 14px; border-radius: 999px; font-size: 12px; font-weight: 800; display: flex; align-items: center; ' + (done ? 'background: #DCFCE7; color: #15803D' : 'background: #0A1130; color: #FFFFFF')
        });
      }),
      early: [
        { img: B + '91bf1841d4c8406abbd784267d171479', save: 'Save 20%', date: 'Fri 30 Oct', name: 'Colombo Jazz Nights', now: 'LKR 3,600', was: 'LKR 4,500' },
        { img: B + 'e1eb3776c653bdbf1992ac3e94d7cb67', save: 'Save 30%', date: 'Sat 7 Nov', name: 'Colombo Derby Night', now: 'LKR 1,050', was: 'LKR 1,500' },
        { img: B + '3fec09965edaaddb40a4fab0940dad5b', save: 'Save 25%', date: 'Sat 31 Oct', name: 'Colombo Food Fair', now: 'LKR 750', was: 'LKR 1,000' }
      ],
      partners: [
        { title: '[Bank] card holders · 10% off', sub: 'Concerts and festivals · weekends' },
        { title: '[Partner] rides · LKR 300 off', sub: 'Your ride home after any event' }
      ]
    };
  }
}

class F2 extends DesignLogic {
  constructor(props) { super(props); this.state = { copied: false }; }
  renderVals() {
    var self = this, done = this.state.copied;
    return {
      btnText: done ? 'Copied' : 'Copy code',
      copy: function () { self.setState({ copied: true }); },
      btn: 'all: unset; cursor: pointer; height: 40px; padding: 0 16px; border-radius: 999px; font-size: 13px; font-weight: 800; display: flex; align-items: center; ' + (done ? 'background: #DCFCE7; color: #15803D' : 'background: #0A1130; color: #FFFFFF')
    };
  }
}

class G1 extends DesignLogic {
  constructor(props) { super(props); this.state = { mode: 'email' }; }
  renderVals() {
    var self = this, e = this.state.mode === 'email';
    var on = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; background: #FFFFFF; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(10,17,48,0.08)';
    var off = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; color: #4A5368; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center';
    return {
      isEmail: e, isPhone: !e, tabEmail: e ? on : off, tabPhone: e ? off : on,
      toEmail: function () { self.setState({ mode: 'email' }); },
      toPhone: function () { self.setState({ mode: 'phone' }); }
    };
  }
}

class G2 extends DesignLogic {
  constructor(props) { super(props); this.state = { code: '4821' }; }
  renderVals() {
    var self = this, code = this.state.code;
    var boxes = [];
    for (var i = 0; i < 6; i++) {
      var filled = i < code.length, active = i === code.length;
      boxes.push({ d: filled ? code[i] : '', style: 'height: 56px; border-radius: 14px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; background: ' + (filled ? '#FFFFFF' : '#F7F8FB') + '; border: ' + (active ? '2px solid #2F5BFF' : '1px solid #E3E7F1') });
    }
    var labels = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
    var keys = labels.map(function (l) {
      return {
        label: l, aria: l === '⌫' ? 'Delete' : (l || 'blank'),
        style: 'all: unset; cursor: pointer; height: 48px; border-radius: 14px; font-size: 20px; font-weight: 700; display: flex; align-items: center; justify-content: center; ' + (l ? 'background: #F4F6FB' : 'visibility: hidden'),
        press: function () {
          if (l === '⌫') self.setState({ code: code.slice(0, -1) });
          else if (l && code.length < 6) self.setState({ code: code + l });
        }
      };
    });
    var done = code.length === 6;
    return {
      boxes: boxes, keys: keys, showError: false,
      cta: 'height: 54px; border-radius: 999px; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; text-decoration: none; background: ' + (done ? '#2F5BFF' : '#B9C1D3') + (done ? '' : '; pointer-events: none')
    };
  }
}

class G3 extends DesignLogic {
  renderVals() { return {}; }
}

class G4 extends DesignLogic {
  renderVals() { return {}; }
}

class G5 extends DesignLogic {
  renderVals() { return {}; }
}

class G6 extends DesignLogic {
  constructor(props) { super(props); this.state = { sel: 'Colombo' }; }
  renderVals() {
    var self = this, sel = this.state.sel;
    var list = [['Colombo', '42 events'], ['Jaffna', '9 events'], ['Kandy', '11 events'], ['Galle', '7 events'], ['Negombo', '5 events'], ['Trincomalee', '3 events'], ['Batticaloa', '4 events']];
    return {
      sel: sel,
      cities: list.map(function (c, i) {
        var on = c[0] === sel;
        return {
          name: c[0], count: c[1], on: on,
          pick: function () { self.setState({ sel: c[0] }); },
          row: 'all: unset; cursor: pointer; width: 100%; box-sizing: border-box; display: flex; align-items: center; gap: 12px; padding: 11px 0;' + (i < list.length - 1 ? ' border-bottom: 1px solid #EEF1F7;' : ''),
          radio: 'width: 22px; height: 22px; border-radius: 999px; box-sizing: border-box; flex-shrink: 0; ' + (on ? 'border: 7px solid #2F5BFF' : 'border: 2px solid #B9C1D3')
        };
      })
    };
  }
}

class G7 extends DesignLogic {
  renderVals() {
    function w(rot, op) { return 'width: 100%; position: relative; box-sizing: border-box; background: rgba(255,255,255,' + op + '); border-radius: 18px; padding: 12px; display: flex; gap: 10px; align-items: center; transform: rotate(' + rot + 'deg); box-shadow: 0 12px 24px rgba(6,12,40,0.25)'; }
    return {
      samples: [
        { time: 'now', text: 'Tamil Fest starts in 2 hours. Doors open 6:45 PM — your tickets are ready.', wrap: w(-2, 0.97) },
        { time: '1h ago', text: 'Colombo Jazz Nights is selling fast — only 20 seats left.', wrap: w(1.5, 0.9) },
        { time: 'Mon', text: 'Pulse Live LK just announced a new event.', wrap: w(-1, 0.8) }
      ]
    };
  }
}

class H1 extends DesignLogic {
  constructor(props) { super(props); this.state = { allRead: false }; }
  renderVals() {
    var self = this, read = this.state.allRead;
    function n(kind, title, body, time, href, unread) {
      var u = unread && !read;
      var tone = kind === 'alert' ? ['#FFF4E5', '#9A3412'] : (kind === 'tag' ? ['#DCFCE7', '#15803D'] : ['#EAF0FF', '#2F5BFF']);
      return {
        title: title, body: body, time: time, href: href, unread: u,
        isTicket: kind === 'ticket', isFire: kind === 'fire', isTag: kind === 'tag', isAlert: kind === 'alert', isMic: kind === 'mic',
        iconWrap: 'width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: ' + tone[0] + '; color: ' + tone[1],
        card: 'display: flex; align-items: flex-start; gap: 12px; padding: 12px; border-radius: 18px; text-decoration: none; color: #0A1130; border: 1px solid ' + (u ? '#C9D5FF' : '#E3E7F1') + '; background: ' + (u ? '#FFFFFF' : '#FAFBFD')
      };
    }
    return {
      markLabel: read ? 'All read' : 'Mark all read',
      markAll: function () { self.setState({ allRead: true }); },
      groups: [
        { title: 'TODAY', items: [
          n('alert', 'Time change', 'Stand-up Saturdays now starts at 8:30 PM. Your tickets are still valid.', '2h', 'Postponed.dc.html', true),
          n('fire', 'Selling fast', 'Colombo Jazz Nights — only 20 seats left. You saved this event.', '4h', 'Event.dc.html', true),
          n('tag', 'New code for you', 'EARLYBIRD: LKR 1,000 off Tamil Fest. Ends Sunday.', '6h', 'PromoDetail.dc.html', true)
        ] },
        { title: 'EARLIER', items: [
          n('ticket', 'Booking confirmed', 'Tamil Fest 2026 · 2 × Gold · Seats G5, G6.', 'Mon', 'BookingDetail.dc.html', false),
          n('mic', 'Pulse Live LK announced', 'Indie Night Live — Sat 17 Oct, Colombo 03.', 'Sun', 'Organiser.dc.html', false),
          n('ticket', 'Welcome to SeatSnaps', 'Find your night — save events to get reminders.', 'Oct 10', 'Home.dc.html', false)
        ] }
      ]
    };
  }
}

class H2 extends DesignLogic {
  constructor(props) { super(props); this.state = { sel: 1 }; }
  renderVals() {
    var self = this, B = '/_blob/';
    var data = [
      { x: 120, y: 200, price: 'LKR 4,500', name: 'Colombo Jazz Nights', date: 'Fri 30 Oct · 8:00 PM', venue: 'Galle Face', dist: '3.1 km', img: B + '91bf1841d4c8406abbd784267d171479' },
      { x: 236, y: 300, price: 'LKR 2,000', name: 'Tamil Fest 2026', date: 'Sat 24 Oct · 7:30 PM', venue: 'Nelum Pokuna', dist: '1.2 km', img: B + '38d8301699fbd525716d5ddf2cd98a11' },
      { x: 160, y: 380, price: 'Free', name: 'Board Game Hangout 6', date: 'Sat 17 Oct · 4:00 PM', venue: 'Colombo 07', dist: '0.8 km', img: B + 'bd7dc1449b1f824e5dc30205fbff2f77' },
      { x: 290, y: 450, price: 'LKR 1,500', name: 'Colombo Derby Night', date: 'Sat 7 Nov · 6:30 PM', venue: 'Sugathadasa Stadium', dist: '2.4 km', img: B + 'e1eb3776c653bdbf1992ac3e94d7cb67' },
      { x: 100, y: 520, price: 'LKR 2,000', name: 'Stand-up Saturdays', date: 'Sat 17 Oct · 8:00 PM', venue: 'Colombo 03', dist: '1.9 km', img: B + 'be55be5a266eff72addd53c16a5d112b' },
      { x: 250, y: 560, price: 'Free', name: 'Nexus Career Fair', date: 'Thu 12 Nov · 9:00 AM', venue: 'BMICH', dist: '1.5 km', img: B + '3fec09965edaaddb40a4fab0940dad5b' }
    ];
    var sel = this.state.sel;
    return {
      sel: data[sel],
      pins: data.map(function (d, i) {
        var on = i === sel;
        return {
          price: d.price, on: on, aria: d.name + ', ' + d.price,
          pick: function () { self.setState({ sel: i }); },
          style: 'all: unset; cursor: pointer; position: absolute; left: ' + d.x + 'px; top: ' + d.y + 'px; height: 34px; padding: 0 12px; border-radius: 999px; font-size: 13px; font-weight: 800; display: flex; align-items: center; box-shadow: 0 6px 14px rgba(10,17,48,0.22); ' + (on ? 'background: #2F5BFF; color: #FFFFFF; transform: scale(1.12)' : 'background: #FFFFFF; color: #0A1130')
        };
      })
    };
  }
}

class H3 extends DesignLogic {
  renderVals() { return {}; }
}

class H4 extends DesignLogic {
  constructor(props) { super(props); this.state = { a: 17, b: 18 }; }
  renderVals() {
    var self = this, s = this.state, today = 14, offset = 4;
    var lo = s.a, hi = s.b || s.a;
    var days = [];
    for (var i = 0; i < offset; i++) days.push({ n: '', past: true, cell: 'height: 44px', btn: 'all: unset; visibility: hidden', aria: 'blank', pick: function () {} });
    for (var d = 1; d <= 31; d++) {
      (function (d) {
        var past = d < today, inR = lo && d >= lo && d <= hi, end = d === lo || d === hi;
        var cell = 'height: 44px; display: flex; align-items: center; justify-content: center;';
        if (inR && lo !== hi) cell += ' background: #EAF0FF;' + (d === lo ? ' border-radius: 999px 0 0 999px;' : '') + (d === hi ? ' border-radius: 0 999px 999px 0;' : '');
        var btn = 'all: unset; width: 40px; height: 40px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 15px; box-sizing: border-box; ';
        if (past) btn += 'color: #B9C1D3; cursor: not-allowed;';
        else if (end) btn += 'background: #2F5BFF; color: #FFFFFF; font-weight: 800; cursor: pointer;';
        else if (inR) btn += 'color: #1E40C8; font-weight: 700; cursor: pointer;';
        else btn += 'color: #0A1130; font-weight: 600; cursor: pointer;' + (d === today ? ' border: 1.5px solid #0A1130;' : '');
        days.push({
          n: d, past: past, cell: cell, btn: btn, aria: d + ' October' + (d === today ? ', today' : ''),
          pick: function () {
            if (past) return;
            if (!s.a || s.b) self.setState({ a: d, b: null });
            else if (d < s.a) self.setState({ a: d, b: s.a });
            else self.setState({ b: d });
          }
        });
      })(d);
    }
    var chipOn = 'all: unset; cursor: pointer; height: 38px; padding: 0 14px; border-radius: 999px; background: #0A1130; color: #FFFFFF; font-size: 13px; font-weight: 700; display: flex; align-items: center';
    var chipOff = 'all: unset; cursor: pointer; height: 38px; padding: 0 14px; border-radius: 999px; border: 1px solid #E3E7F1; box-sizing: border-box; font-size: 13px; font-weight: 600; display: flex; align-items: center';
    var q = [['Today', 14, 14], ['Tomorrow', 15, 15], ['This weekend', 17, 18], ['Next 7 days', 14, 20]];
    var label = !lo ? 'Show all dates' : (lo === hi ? 'Show events · ' + lo + ' Oct' : 'Show events · ' + lo + '–' + hi + ' Oct');
    return {
      dow: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      days: days,
      quick: q.map(function (x) { var on = lo === x[1] && hi === x[2]; return { label: x[0], style: on ? chipOn : chipOff, pick: function () { self.setState({ a: x[1], b: x[2] }); } }; }),
      clear: function () { self.setState({ a: null, b: null }); },
      cta: label
    };
  }
}

class H5 extends DesignLogic {
  renderVals() {
    var B = '/_blob/';
    return {
      venues: [
        { img: B + '49d4b856f575dc51c032b2e2e9d3f601', name: 'Nelum Pokuna Theatre', type: 'Theatre', area: 'Colombo 07', events: '6 upcoming', dist: '1.2 km' },
        { img: B + 'e1eb3776c653bdbf1992ac3e94d7cb67', name: 'Sugathadasa Stadium', type: 'Stadium', area: 'Colombo 13', events: '3 upcoming', dist: '2.4 km' },
        { img: B + 'f1f81e751b97d500437d51ca82299234', name: 'Galle Face Green', type: 'Outdoor', area: 'Colombo 01', events: '6 upcoming', dist: '3.1 km' },
        { img: B + '3fec09965edaaddb40a4fab0940dad5b', name: 'BMICH', type: 'Convention centre', area: 'Colombo 07', events: '4 upcoming', dist: '1.5 km' },
        { img: B + 'be55be5a266eff72addd53c16a5d112b', name: 'The Jazz Room', type: 'Club', area: 'Colombo 03', events: '2 upcoming', dist: '1.9 km' }
      ]
    };
  }
}

class I1 extends DesignLogic {
  constructor(props) { super(props); this.state = { q: { 'Early bird': 0, 'General entry': 2, 'Family pass': 0 } }; }
  renderVals() {
    var self = this, q = this.state.q;
    var defs = [
      { name: 'Early bird', price: 750, perk: 'Entry + 1 tasting token', sold: true },
      { name: 'General entry', price: 1000, perk: 'Entry + 1 tasting token', sold: false },
      { name: 'Family pass', price: 3500, perk: '2 adults + 2 kids · 4 tokens', sold: false }
    ];
    var count = 0, sum = 0, picked = [];
    defs.forEach(function (d) { count += q[d.name]; sum += q[d.name] * d.price; if (q[d.name]) picked.push(q[d.name] + ' × ' + d.name); });
    function fmt(n) { return 'LKR ' + n.toLocaleString('en-US'); }
    function set(n, v) { var o = Object.assign({}, q); o[n] = v; self.setState({ q: o }); }
    var on = count > 0;
    return {
      tiers: defs.map(function (d) {
        var qty = q[d.name];
        return {
          name: d.name, perk: d.perk, priceLabel: fmt(d.price), qty: qty, soldOut: d.sold, open: !d.sold,
          card: 'display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 18px; box-sizing: border-box; ' + (d.sold ? 'background: #F7F8FB; border: 1px dashed #D5DAE6; opacity: 0.8' : 'background: #FFFFFF; border: ' + (qty ? '2px solid #2F5BFF' : '1px solid #E3E7F1')),
          minusStyle: 'all: unset; cursor: pointer; width: 40px; height: 40px; border-radius: 999px; border: 1px solid #E3E7F1; box-sizing: border-box; display: flex; align-items: center; justify-content: center; color: ' + (qty ? '#0A1130' : '#B9C1D3'),
          minusLabel: 'Remove one ' + d.name, plusLabel: 'Add one ' + d.name,
          minus: function () { if (qty > 0) set(d.name, qty - 1); },
          plus: function () { if (count < 10) set(d.name, qty + 1); }
        };
      }),
      summary: on ? picked.join(', ') : 'No tickets yet',
      total: fmt(sum),
      cta: 'height: 54px; border-radius: 999px; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; text-decoration: none; background: ' + (on ? '#2F5BFF' : '#B9C1D3') + (on ? '' : '; pointer-events: none')
    };
  }
}

class I2 extends DesignLogic {
  constructor(props) { super(props); this.state = { n: 1, done: false }; }
  renderVals() {
    var self = this, s = this.state;
    return {
      n: s.n, spotWord: s.n === 1 ? 'spot' : 'spots', todo: !s.done, done: s.done,
      minus: function () { if (s.n > 1) self.setState({ n: s.n - 1 }); },
      plus: function () { if (s.n < 2) self.setState({ n: s.n + 1 }); },
      reserve: function () { self.setState({ done: true }); },
      undo: function () { self.setState({ done: false }); }
    };
  }
}

class I3 extends DesignLogic {
  renderVals() { return {}; }
}

class I4 extends DesignLogic {
  renderVals() { return {}; }
}

class I5 extends DesignLogic {
  renderVals() { return {}; }
}

class I6 extends DesignLogic {
  constructor(props) { super(props); this.state = { waiting: false }; }
  renderVals() {
    var self = this, w = this.state.waiting;
    return {
      waiting: w, notWaiting: !w,
      btnText: w ? 'Leave waitlist' : 'Join waitlist',
      toggle: function () { self.setState({ waiting: !w }); },
      btn: 'all: unset; cursor: pointer; flex: 1; height: 54px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; box-sizing: border-box; ' + (w ? 'border: 1px solid #E3E7F1; color: #0A1130' : 'background: #0A1130; color: #FFFFFF')
    };
  }
}

class I7 extends DesignLogic {
  renderVals() { return {}; }
}

class I8 extends DesignLogic {
  renderVals() { return {}; }
}

class I9 extends DesignLogic {
  renderVals() { return {}; }
}

class J1 extends DesignLogic {
  renderVals() { return {}; }
}

class J2 extends DesignLogic {
  constructor(props) { super(props); this.state = { sent: false }; }
  renderVals() {
    var self = this, s = this.state.sent;
    return { todo: !s, done: s, send: function () { self.setState({ sent: true }); }, undo: function () { self.setState({ sent: false }); } };
  }
}

class J3 extends DesignLogic {
  constructor(props) { super(props); this.state = { sel: { G5: true, G6: true }, reason: "Can't attend", done: false }; }
  renderVals() {
    var self = this, s = this.state;
    var seats = ['G5', 'G6'];
    var count = seats.filter(function (x) { return s.sel[x]; }).length;
    var on = 'all: unset; cursor: pointer; height: 40px; padding: 0 14px; border-radius: 999px; background: #0A1130; color: #FFFFFF; font-size: 13px; font-weight: 700; display: flex; align-items: center';
    var off = 'all: unset; cursor: pointer; height: 40px; padding: 0 14px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E3E7F1; box-sizing: border-box; font-size: 13px; font-weight: 600; display: flex; align-items: center';
    var ok = count > 0;
    return {
      todo: !s.done, done: s.done, count: count, word: count === 1 ? 'ticket' : 'tickets',
      ticketsAmt: 'LKR ' + (count * 5000).toLocaleString('en-US'),
      tix: seats.map(function (x, i) {
        return { seat: x, on: !!s.sel[x],
          row: 'display: flex; align-items: center; gap: 12px; padding: 12px 0; cursor: pointer;' + (i === 0 ? ' border-bottom: 1px solid #EEF1F7;' : ''),
          toggle: function () { var n = Object.assign({}, s.sel); n[x] = !n[x]; self.setState({ sel: n }); } };
      }),
      reasons: ["Can't attend", 'Bought by mistake', 'Event changed', 'Other'].map(function (r) {
        return { label: r, on: s.reason === r, style: s.reason === r ? on : off, pick: function () { self.setState({ reason: r }); } };
      }),
      submit: function () { if (ok) self.setState({ done: true }); },
      cta: 'all: unset; margin-top: auto; cursor: pointer; height: 54px; border-radius: 999px; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; background: ' + (ok ? '#B42318' : '#B9C1D3')
    };
  }
}

class J4 extends DesignLogic {
  constructor(props) { super(props); this.state = { i: 0 }; }
  renderVals() {
    var self = this, i = this.state.i, n = 21, cells = [], seed = i ? 41 : 17;
    function finder(r, c) {
      var corners = [[0,0],[0,n-7],[n-7,0]];
      for (var k = 0; k < 3; k++) {
        var y = r - corners[k][0], x = c - corners[k][1];
        if (y >= 0 && y < 7 && x >= 0 && x < 7) return (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) ? 1 : 0;
        if (y >= -1 && y <= 7 && x >= -1 && x <= 7) return 0;
      }
      return -1;
    }
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      var f = finder(r, c), on;
      if (f !== -1) on = f === 1; else { seed = (seed * 9301 + 49297) % 233280; on = seed / 233280 > 0.5; }
      cells.push({ style: 'display: block; width: 100%; aspect-ratio: 1; background: ' + (on ? '#0A1130' : 'transparent') });
    }
    var seat = i ? 'G6' : 'G5';
    return {
      qr: cells, seat: seat, idx: i + 1, qrLabel: 'Entry QR code for seat ' + seat,
      prev: function () { self.setState({ i: 0 }); },
      next: function () { self.setState({ i: 1 }); }
    };
  }
}

class J5 extends DesignLogic {
  constructor(props) { super(props); this.state = { open: 0 }; }
  renderVals() {
    var self = this, o = this.state.open;
    var faqs = [
      ['Where are my tickets?', 'Open Profile → My tickets & bookings. Your tickets are also emailed to you and work offline once opened.'],
      ['Can I get a refund?', 'Most events allow refunds up to 48 hours before the start. Open the booking and tap "Cancel booking & request refund". The booking fee is not refundable.'],
      ['How do I send a ticket to a friend?', 'Open the booking, tap Send next to the seat and enter their email or phone. They get their own QR code.'],
      ['The event was cancelled. What now?', 'You are refunded automatically to your original payment method within 5–7 working days.'],
      ['My payment failed but money was taken', 'Failed payments are reversed by your bank, usually within 3 working days. If not, contact us with your order number.']
    ];
    return {
      topics: [{ name: 'Tickets & entry', n: '12 articles' }, { name: 'Payments & refunds', n: '9 articles' }, { name: 'My account', n: '7 articles' }, { name: 'For organisers', n: '15 articles' }],
      faqs: faqs.map(function (f, i) {
        var open = o === i;
        return {
          q: f[0], a: f[1], open: open,
          toggle: function () { self.setState({ open: open ? -1 : i }); },
          chev: 'flex-shrink: 0; transform: rotate(' + (open ? 180 : 0) + 'deg)',
          wrap: i < faqs.length - 1 ? 'border-bottom: 1px solid #EEF1F7' : ''
        };
      })
    };
  }
}

class J6 extends DesignLogic {
  constructor(props) { super(props); this.state = { t: 'Refund' }; }
  renderVals() {
    var self = this, t = this.state.t;
    var on = 'all: unset; cursor: pointer; height: 38px; padding: 0 14px; border-radius: 999px; background: #0A1130; color: #FFFFFF; font-size: 13px; font-weight: 700; display: flex; align-items: center';
    var off = 'all: unset; cursor: pointer; height: 38px; padding: 0 14px; border-radius: 999px; background: #FFFFFF; border: 1px solid #E3E7F1; box-sizing: border-box; font-size: 13px; font-weight: 600; display: flex; align-items: center';
    return {
      topics: ['Tickets', 'Payment', 'Refund', 'Account', 'Other'].map(function (x) {
        return { label: x, on: t === x, style: t === x ? on : off, pick: function () { self.setState({ t: x }); } };
      })
    };
  }
}

class J7 extends DesignLogic {
  constructor(props) { super(props); this.state = { tab: 'terms' }; }
  renderVals() {
    var self = this, t = this.state.tab === 'terms';
    var on = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; background: #FFFFFF; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(10,17,48,0.08)';
    var off = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; color: #4A5368; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center';
    var terms = ['Using SeatSnaps', 'Buying tickets', 'Refunds & cancellations', 'Transfers & resale', 'Your account'];
    var priv = ['What we collect', 'How we use it', 'Sharing with organisers', 'Your choices', 'Contact us'];
    return {
      isTerms: t, isPriv: !t, tabTerms: t ? on : off, tabPriv: t ? off : on,
      toTerms: function () { self.setState({ tab: 'terms' }); },
      toPriv: function () { self.setState({ tab: 'priv' }); },
      title: t ? 'Terms of use' : 'Privacy policy',
      sections: (t ? terms : priv).map(function (h, i) { return { n: i + 1, h: h }; })
    };
  }
}

class J8 extends DesignLogic {
  renderVals() {
    return {
      perks: [
        { t: 'Seat maps or general admission', d: 'Build sections and tiers, or sell simple entry passes.' },
        { t: 'Free events too', d: 'Take RSVPs with a QR pass — no payment needed.' },
        { t: 'Scan at the door', d: 'Use the organiser app to check guests in, even offline.' },
        { t: 'Payouts to your bank', d: 'Track sales live and get paid after the event. Fees: [fee terms].' }
      ]
    };
  }
}

class J9 extends DesignLogic {
  renderVals() { return {}; }
}

class J10 extends DesignLogic {
  constructor(props) { super(props); this.state = { v: '' }; }
  renderVals() {
    var self = this, ok = this.state.v.trim().toUpperCase() === 'DELETE';
    return {
      onType: function (e) { self.setState({ v: e.target.value }); },
      cta: 'height: 54px; border-radius: 999px; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; text-decoration: none; background: ' + (ok ? '#B42318' : '#E7B4AF') + (ok ? '' : '; pointer-events: none')
    };
  }
}

class K1 extends DesignLogic {
  renderVals() { return {}; }
}

class K2 extends DesignLogic {
  renderVals() { return {}; }
}

class K3 extends DesignLogic {
  renderVals() { return {}; }
}

class L1 extends DesignLogic {
  constructor(props) { super(props); this.state = { day: 17, time: 1 }; }
  renderVals() {
    var self = this, s = this.state;
    var days = [[16, 'FRI', 1], [17, 'SAT', 3], [18, 'SUN', 2], [23, 'FRI', 1], [24, 'SAT', 1]];
    var shows = {
      16: [['8:00 PM', 'Opening night', 'Selling fast', 'LKR 2,500', false]],
      17: [['4:00 PM', 'Family matinee', 'Available', 'LKR 1,500', false], ['7:30 PM', 'Main show', 'Only 18 left', 'LKR 2,000', false], ['10:00 PM', 'Late show · 18+', 'Sold out', '—', true]],
      18: [['5:00 PM', 'Main show', 'Available', 'LKR 2,000', false], ['8:30 PM', 'Main show', 'Available', 'LKR 2,000', false]],
      23: [['8:00 PM', 'Main show', 'Available', 'LKR 2,000', false]],
      24: [['8:00 PM', 'Closing night', 'Available', 'LKR 2,500', false]]
    };
    var list = shows[s.day];
    var ti = Math.min(s.time, list.length - 1);
    if (list[ti][4]) ti = 0;
    var cur = list[ti], dd = days.filter(function (d) { return d[0] === s.day; })[0];
    return {
      days: days.map(function (d) {
        var on = d[0] === s.day;
        return { n: d[0], dow: d[1], count: d[2] + (d[2] === 1 ? ' show' : ' shows'), on: on,
          pick: function () { self.setState({ day: d[0], time: 0 }); },
          style: 'all: unset; cursor: pointer; flex-shrink: 0; width: 62px; height: 78px; border-radius: 18px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; ' + (on ? 'background: #0A1130; color: #FFFFFF' : 'background: #FFFFFF; border: 1px solid #E3E7F1; color: #0A1130') };
      }),
      times: list.map(function (t, i) {
        var on = i === ti && !t[4], sold = t[4];
        return { time: t[0], label: t[1], avail: t[2], price: t[3], sold: sold, on: on,
          availColor: sold ? '#7A8398' : (t[2] === 'Available' ? '#15803D' : '#C2410C'),
          pick: function () { if (!sold) self.setState({ time: i }); },
          card: 'all: unset; cursor: ' + (sold ? 'not-allowed' : 'pointer') + '; display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 18px; box-sizing: border-box; ' + (sold ? 'background: #F7F8FB; border: 1px dashed #D5DAE6; opacity: 0.75' : 'background: #FFFFFF; border: ' + (on ? '2px solid #2F5BFF' : '1px solid #E3E7F1')) };
      }),
      summary: dd[1].charAt(0) + dd[1].slice(1).toLowerCase() + ' ' + s.day + ' Oct · ' + cur[0] + ' · ' + cur[1]
    };
  }
}

class L2 extends DesignLogic {
  renderVals() { return {}; }
}

class L3 extends DesignLogic {
  constructor(props) { super(props); this.state = { num: '' }; }
  renderVals() {
    var self = this, d = (this.state.num || '').replace(/\D/g, '').slice(0, 16);
    var shown = (d + '################').slice(0, 16).replace(/#/g, '•');
    var masked = shown.replace(/(.{4})/g, '$1 ').trim();
    var brand = d[0] === '4' ? 'VISA' : (d[0] === '5' ? 'MASTERCARD' : (d[0] === '3' ? 'AMEX' : 'CARD'));
    return { masked: masked, brand: brand, onNum: function (e) { self.setState({ num: e.target.value }); } };
  }
}

class L4 extends DesignLogic {
  constructor(props) { super(props); this.state = { i: 0 }; }
  renderVals() {
    var self = this, i = this.state.i;
    var v = [
      ['EARLYBRID', "We couldn't find that code.", 'Check the spelling — codes are not case-sensitive.'],
      ['SUMMER25', 'This code expired on 30 Sep.', 'Look for current offers in Promotions.'],
      ['LAUGH10', 'This code needs 2+ comedy tickets.', 'It doesn’t apply to Tamil Fest tickets.'],
      ['FIRSTSNAP', "You've already used this code.", 'First-booking codes work once per account.']
    ][i];
    return { code: v[0], msg: v[1], hint: v[2], idx: i + 1, yes: true, next: function () { self.setState({ i: (i + 1) % 4 }); } };
  }
}

class L5 extends DesignLogic {
  constructor(props) { super(props); this.state = { r: 4, tags: ['Performers', 'Sound'], done: false }; }
  renderVals() {
    var self = this, s = this.state;
    var words = ['', 'Not great', 'It was okay', 'Good night', 'Great night', 'Unforgettable'];
    var on = 'all: unset; cursor: pointer; height: 38px; padding: 0 14px; border-radius: 999px; background: #0A1130; color: #FFFFFF; font-size: 13px; font-weight: 700; display: flex; align-items: center';
    var off = 'all: unset; cursor: pointer; height: 38px; padding: 0 14px; border-radius: 999px; border: 1px solid #E3E7F1; box-sizing: border-box; font-size: 13px; font-weight: 600; display: flex; align-items: center';
    return {
      todo: !s.done, done: s.done, word: words[s.r],
      stars: [1, 2, 3, 4, 5].map(function (n) {
        var f = n <= s.r;
        return { on: n === s.r, aria: n + (n === 1 ? ' star' : ' stars'), fill: f ? '#2F5BFF' : 'none', stroke: f ? '#2F5BFF' : '#B9C1D3', pick: function () { self.setState({ r: n }); } };
      }),
      tags: ['Performers', 'Sound', 'Venue', 'Organisation', 'Food & drinks', 'Value for money'].map(function (t) {
        var o = s.tags.indexOf(t) !== -1;
        return { label: t, on: o, style: o ? on : off, toggle: function () { self.setState({ tags: o ? s.tags.filter(function (x) { return x !== t; }) : s.tags.concat([t]) }); } };
      }),
      submit: function () { if (s.r) self.setState({ done: true }); },
      cta: 'all: unset; margin-top: auto; cursor: pointer; height: 54px; border-radius: 999px; background: #2F5BFF; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700'
    };
  }
}

class L6 extends DesignLogic {
  renderVals() { return {}; }
}

class L7 extends DesignLogic {
  renderVals() { return {}; }
}

class L8 extends DesignLogic {
  renderVals() { return {}; }
}

class L9 extends DesignLogic {
  renderVals() { return {}; }
}

class L10 extends DesignLogic {
  constructor(props) { super(props); this.state = { tab: 'org', off: {} }; }
  renderVals() {
    var self = this, s = this.state, B = '/_blob/';
    var tOn = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; background: #FFFFFF; font-size: 14px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(10,17,48,0.08)';
    var tOff = 'all: unset; cursor: pointer; height: 40px; border-radius: 999px; color: #4A5368; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center';
    function av(bg, fg) { return 'width: 52px; height: 52px; border-radius: 999px; background: ' + bg + '; color: ' + fg + '; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0'; }
    var orgs = [
      { id: 'ta', initials: 'TA', name: 'Tamil Arts Circle', meta: '3 upcoming · next Sat 24 Oct', avatar: av('#0A1130', '#FFFFFF'), href: 'Organiser.dc.html' },
      { id: 'pl', initials: 'PL', name: 'Pulse Live LK', meta: '8 upcoming · next Sat 17 Oct', avatar: av('#2F5BFF', '#FFFFFF'), href: 'Organiser.dc.html' },
      { id: 'cc', initials: 'CC', name: 'Colombo Comedy Co.', meta: '5 upcoming · next Sat 17 Oct', avatar: av('#EAF0FF', '#1E40C8'), href: 'Organiser.dc.html' }
    ];
    var vens = [
      { id: 'np', img: B + '49d4b856f575dc51c032b2e2e9d3f601', name: 'Nelum Pokuna Theatre', meta: '6 upcoming · Colombo 07', href: 'Venue.dc.html' },
      { id: 'gf', img: B + 'f1f81e751b97d500437d51ca82299234', name: 'Galle Face Green', meta: '6 upcoming · Colombo 01', href: 'Venue.dc.html' }
    ];
    var isOrg = s.tab === 'org';
    var rows = (isOrg ? orgs : vens).map(function (r) {
      var on = !s.off[r.id];
      return Object.assign({}, r, {
        on: on, hasImg: !!r.img, noImg: !r.img, btnText: on ? 'Following' : 'Follow',
        toggle: function () { var o = Object.assign({}, s.off); o[r.id] = on; self.setState({ off: o }); },
        btn: 'all: unset; cursor: pointer; height: 36px; padding: 0 14px; border-radius: 999px; font-size: 13px; font-weight: 800; display: flex; align-items: center; flex-shrink: 0; box-sizing: border-box; ' + (on ? 'border: 1px solid #E3E7F1; color: #0A1130' : 'background: #2F5BFF; color: #FFFFFF')
      });
    });
    return {
      isOrg: isOrg, isVen: !isOrg, tabOrg: isOrg ? tOn : tOff, tabVen: isOrg ? tOff : tOn,
      toOrg: function () { self.setState({ tab: 'org' }); }, toVen: function () { self.setState({ tab: 'ven' }); },
      orgCount: orgs.length, venCount: vens.length, rows: rows
    };
  }
}

class L11 extends DesignLogic {
  renderVals() { return {}; }
}

class L12 extends DesignLogic {
  renderVals() { return {}; }
}

export const models = {A1, A2, A3, A4, A5, B1, B2, B3, B4, C1, C2, C3, C4, C5, C6, C7, C8, D1, D2, D3, D4, D5, D6, D7, E1, E2, E3, E4, E5, E6, E7, E8, F1, F2, G1, G2, G3, G4, G5, G6, G7, H1, H2, H3, H4, H5, I1, I2, I3, I4, I5, I6, I7, I8, I9, J1, J2, J3, J4, J5, J6, J7, J8, J9, J10, K1, K2, K3, L1, L2, L3, L4, L5, L6, L7, L8, L9, L10, L11, L12};
