import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import rawScreens from './generated/screens.json';
import { type DesignScreen as ScreenDefinition, type DesignNode } from './model';
import { NativeDesign, type DesignAction } from './NativeDesign';
import { nativeStyle } from './styles';
import { destination } from './navigation';
import { useDesignStore } from './store';

export const screens = rawScreens as unknown as ScreenDefinition[];
export const screenById = Object.fromEntries(screens.map(s => [s.id,s]));
const mainTabs = new Set(['C1','C2','F1','E2']);
const initialFields = (node: DesignNode, values: Record<string,string> = {}) => {
  if (typeof node === 'string') return values;
  if (['input','textarea'].includes(node.tag)) {
    const key=node.attrs.id || node.attrs.name || node.attrs.placeholder;
    if(key) values[key]=node.attrs.value && !node.attrs.value.includes('{{') ? node.attrs.value : '';
  }
  node.children.forEach(child=>initialFields(child,values));
  return values;
};

export function DesignScreen({ id }: { id: string }) {
  'use no memo'; // The imported observable models mutate their own state outside React.
  const store = useDesignStore();
  const {height,width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const screen = screenById[id];
  const model = store.model(id);
  model.context = store.data.booking;
  const state = useSyncExternalStore(model.subscribe,model.snapshot,model.snapshot);
  const scope = useMemo(() => ({...model.renderVals(), $width:Math.min(width,480)}),[model,state,store.data.booking,width]);
  const [localNotice,setLocalNotice] = useState('');
  const notice = localNotice || store.data.notice;
  const closeNotice = () => {setLocalNotice('');store.update({notice:''});};
  const go = (target: string) => {
    if (target === 'back') {
      if(router.canGoBack()) router.back(); else router.replace('/screens/C1');
    } else if(mainTabs.has(target)) router.replace({pathname:'/screens/[id]',params:{id:target}});
    else router.push({pathname:'/screens/[id]',params:{id:target}});
  };
  useEffect(() => {
    const next: Record<string,string>={A1:'A2',A2:'B1',I3:'D6'};
    if (!next[id]) return;
    const timer = setTimeout(() => router.replace({pathname:'/screens/[id]',params:{id:next[id]}}),id==='I3'?2200:1600);
    return () => clearTimeout(timer);
  },[id]);
  if (!screen) return <View style={styles.missing}><Text>Screen not found.</Text><Pressable accessibilityRole="button" onPress={()=>router.replace('/screen-library')}><Text style={styles.link}>Open screen library</Text></Pressable></View>;
  const fields = {...initialFields(screen.tree),...store.data.form[id]};
  const values = Object.entries(fields);
  const inputNodes: Exclude<DesignNode,string>[]=[];
  const collectInputs=(node: DesignNode) => {if(typeof node==='string')return;if(['input','textarea'].includes(node.tag))inputNodes.push(node);node.children.forEach(collectInputs);};
  collectInputs(screen.tree);
  const field = (pattern: RegExp) => {
    const input=inputNodes.find(n=>pattern.test([n.attrs.id,n.attrs.name,n.attrs.placeholder,n.attrs.autocomplete].join(' ')));
    if(!input) return '';
    return fields[input.attrs.id || input.attrs.name || input.attrs.placeholder || '']?.trim() || '';
  };
  const validate = (label: string) => {
    if (['A3','A4','G1'].includes(id) && /^(sign in|continue|send code)$/i.test(label)) {
      const email = field(/email/i);
      if (id !== 'G1' || model.state.mode !== 'phone') {
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address to continue.';
      } else if(field(/phone|mobile|number/i).replace(/\D/g,'').length<9) return 'Enter a valid phone number.';
      if(id==='A3' && !field(/password|pw/i)) return 'Enter your password.';
    }
    if (id==='A5' && /create account/i.test(label)) {
      if(field(/password|pw/i).length<8) return 'Use a password with at least 8 characters.';
      if(field(/confirmpw/)!==field(/newpw/)) return 'The passwords do not match.';
      if(!Object.values(store.data.form[id] || {}).includes('true')) return 'Accept the terms to continue.';
    }
    if(id==='L2' && /verify/i.test(label) && (store.data.form.L2?.verification || '').length!==6) return 'Enter all six digits from the demo verification code.';
    if (id==='G2' && label==='Verify' && String(model.state.code||'').length!==6) return 'Enter all six digits of the verification code.';
    if (['G3','G4'].includes(id) && /save|update password/i.test(label)) {
      const passwords=inputNodes.filter(n=>n.attrs.type==='password').map(n=>fields[n.attrs.id || ''] || '');
      if(passwords.some(v=>v.length<8)) return 'Passwords must contain at least 8 characters.';
      if(passwords.length>1 && passwords.at(-1)!==passwords.at(-2)) return 'The new passwords do not match.';
    }
    if (id==='J2' && label==='Send ticket' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field(/contact|email/i)) && field(/contact|email/i).replace(/\D/g,'').length<9) return 'Enter your friend’s email address or phone number.';
    if (id==='J6' && label==='Send message' && field(/message|describe|help/i).length<10) return 'Add a message of at least 10 characters.';
    if(id==='D5' && /^pay /i.test(label)) {
      if(!field(/cname/) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field(/cemail/))) return 'Enter your name and a valid email for this demo booking.';
      if(model.state.method==='card' && (field(/cardno/).replace(/\D/g,'').length<13 || !field(/cc-exp/) || field(/cc-csc/).length<3)) return 'Complete the demo card fields, or choose a different payment method. Do not use real card details.';
    }
    if(id==='L3' && label==='Save card') {
      const digits=field(/acno|cc-number/i).replace(/\D/g,'');
      if(digits.length<13 || digits.length>19 || !field(/acexp|expir|MM/i) || field(/cvv|cvc/i).length<3) return 'Enter a valid demo card number, expiry and security code. Do not use real card details.';
    }
    return '';
  };
  const action = ({label,href,node,callback}: DesignAction) => {
    const error = validate(label);
    if(error) {setLocalNotice(error);return;}
    if(callback) {
      if(id==='D5' && label==='Apply') {
        const code=field(/promo/i).toUpperCase();
        if(code!=='EARLYBIRD') {go('L4');return;}
      }
      callback();
      if(id==='D5' && /apply|remove/i.test(label)) store.update({booking:{...store.data.booking,promo:!!model.state.promo}});
      return;
    }
    if(id==='C6' && label==='Submit search') {
      const query = values.map(([,v])=>v).join(' ').toLowerCase();
      go(/jazz|tamil|comedy|festival|concert/.test(query)?'C7':'H3');return;
    }
    if(id==='D2' && /continue/i.test(label)) {
      const quantities=model.state.q || {};
      const count=Object.values(quantities).reduce<number>((sum,n)=>sum+Number(n),0);
      if(!count) {setLocalNotice('Choose at least one ticket.');return;}
      const prices: Record<string,number>={VIP:8000,Gold:5000,Silver:3000,Balcony:2000};
      const subtotal=Object.entries(quantities).reduce((sum,[tier,n])=>sum+prices[tier]*Number(n),0);
      const summary=Object.entries(quantities).filter(([,n])=>Number(n)>0).map(([tier,n])=>`${n} × ${tier}`).join(', ');
      store.update({booking:{...store.data.booking,count,subtotal,summary,seats:store.data.booking.seats.slice(0,count)}});
      store.model('D4').setState({picked:store.data.booking.seats.slice(0,count)});
    }
    if(id==='D3' && label==='Pick seats') store.update({booking:{...store.data.booking,section:model.state.sel}});
    if(id==='D4' && /checkout/i.test(label)) store.update({booking:{...store.data.booking,seats:model.state.picked}});
    if(id==='G6' && /show events/i.test(label)) store.update({city:String(model.state.sel || 'Colombo')});
    if(/^(save|save venue)$/i.test(label)) {store.update({saved:!store.data.saved});setLocalNotice(store.data.saved?'Removed from your saved events.':'Event saved. Find it under Profile → Saved events.');return;}
    if(/^(follow|follow venue|follow tamil arts circle)$/i.test(label)) {store.update({followed:!store.data.followed});setLocalNotice(store.data.followed?'Unfollowed.':'Following. New events will appear in your updates.');return;}
    if(/share/i.test(label) && node.tag==='button') {setLocalNotice('Demo event link: seatsnaps.app/events/tamil-fest-2026');return;}
    if(label==='Continue with Google') {setLocalNotice('Google sign-in is not connected in this UI demo. Use email sign-in or explore Home from the screen library.');return;}
    const target=destination(id,href,label);
    if(target) {
      if(['J9','J10'].includes(id) && target==='A3') {store.reset();setLocalNotice('');}
      if(id==='E7' && label==='Save changes') store.notify('Profile changes saved for this demo session.');
      if(id==='L3' && label==='Save card') store.notify('Demo card added. No card information was sent to a payment service.');
      if(id==='J6' && label==='Send message') store.notify('Demo message saved. No support request was sent.');
      go(target);return;
    }
    if(node.tag==='button' && node.attrs.role==='tab') return;
    if(/^(today|tomorrow|this weekend|next week|all|free|verified|music|comedy)$/i.test(label)) return;
    if(/photo|gallery/i.test(label)) {store.notify(label==='Remove photo'?'Profile photo removed in this demo.':'Photo selection preview. Camera and photo library access will be connected in the integration pass.');return;}
    if(/copy|copied/i.test(label)) {setLocalNotice('Promo code: EARLYBIRD');return;}
    if(/calendar|wallet|download|receipt|invoice|email app|update now|service status|continue on the web|app store|google play|call|chat|email|website|attach|contacts|disconnect|link/i.test(label)) {
      setLocalNotice(`${label}: this is a UI preview. No external action was performed.`);return;
    }
    if(/read more/i.test(label)) {setLocalNotice('Tamil Fest brings music, food and culture together at Nelum Pokuna. Doors open at 6:45 PM. Bring your ticket and a valid photo ID.');return;}
    if(/clear all/i.test(label)) {store.notify('Recent searches cleared for this session.');return;}
    if(/resend code/i.test(label)) {setLocalNotice('Demo code resent: 123456. No email was sent.');return;}
    if(/notify|verification/i.test(label)) {setLocalNotice('Preference updated for this demo session.');return;}
    if(/message/i.test(label)) {go('J6');return;}
    setLocalNotice(`${label || 'Action'} selected in the UI demo.`);
  };
  const rootStyle=nativeStyle(screen.tree.attrs.style || '');
  const rootChildren=[...screen.tree.children];
  const last=rootChildren.at(-1);
  const hasFooter=typeof last==='object' && (last.tag==='nav' || /flex-shrink:\s*0/.test(last.attrs.style || '') && /border-top/.test(last.attrs.style || ''));
  const footer=hasFooter ? rootChildren.pop() : undefined;
  const tree={...screen.tree,children:rootChildren};
  const footerHeight=footer && typeof footer!=='string' && footer.tag==='nav'?84:footer?134:0;
  const bg=String(rootStyle.view.backgroundColor || '#F4F6FB');
  return <View style={styles.outer}>
    <StatusBar style={['A1','A2','A3','B1','B4','J4'].includes(id)?'light':'dark'} />
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={[styles.phone,{backgroundColor:bg}]}>
      <ScrollView key={id} style={{flex:1}} contentContainerStyle={{flexGrow:1}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <NativeDesign node={tree} scope={scope} screen={screen} onAction={action} override={{width:'100%',height:undefined,minHeight:Math.max(480,height-footerHeight-34-insets.bottom),overflow:'visible'}} />
      </ScrollView>
      {footer ? <NativeDesign node={footer} scope={scope} screen={screen} onAction={action} inherited={{fontSize:14,color:'#0A1130'}} /> : null}
      <View style={[styles.toolbar,{paddingBottom:Math.max(insets.bottom,6)}]}>
        <Text style={styles.demo}>{['D7','J4','D6'].includes(id)?'DEMO · NOT VALID FOR ENTRY':'UI DEMO'}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Browse all 80 screens" hitSlop={8} onPress={()=>router.push('/screen-library')}><Text style={styles.library}>All 80 screens ↗</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
    <Modal visible={!!notice} transparent animationType="fade" onRequestClose={closeNotice}>
      <View style={styles.overlay}><View style={styles.dialog}><Text style={styles.dialogTitle}>SeatSnaps</Text><Text style={styles.dialogBody}>{notice}</Text><Pressable accessibilityRole="button" style={styles.dialogButton} onPress={closeNotice}><Text style={styles.dialogButtonText}>Got it</Text></Pressable></View></View>
    </Modal>
  </View>;
}
const styles=StyleSheet.create({
  outer:{flex:1,backgroundColor:'#E7EBF3',alignItems:'center'},phone:{width:'100%',maxWidth:480,flex:1},
  toolbar:{backgroundColor:'#FFFFFF',borderTopWidth:1,borderTopColor:'#E3E7F1',paddingHorizontal:20,paddingTop:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  demo:{fontSize:9,fontWeight:'800',letterSpacing:1,color:'#7A8398'},library:{fontSize:11,fontWeight:'700',color:'#2F5BFF'},
  missing:{flex:1,justifyContent:'center',alignItems:'center',gap:20,backgroundColor:'#F4F6FB'},link:{color:'#2F5BFF',fontWeight:'700'},
  overlay:{flex:1,backgroundColor:'rgba(10,17,48,0.55)',alignItems:'center',justifyContent:'center',padding:24},
  dialog:{backgroundColor:'#FFFFFF',borderRadius:24,padding:24,gap:16,width:'100%',maxWidth:360},dialogTitle:{fontSize:22,fontWeight:'800',color:'#0A1130'},dialogBody:{fontSize:15,lineHeight:23,color:'#4A5368'},dialogButton:{backgroundColor:'#2F5BFF',borderRadius:99,padding:16,alignItems:'center'},dialogButtonText:{color:'#FFFFFF',fontWeight:'700',fontSize:16},
});
