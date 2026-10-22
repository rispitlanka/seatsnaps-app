import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screens } from '@/features/designs/DesignScreen';
const groups=['All screens','Onboarding & booking','Profile & account','Discovery & support','States & extras'];
export default function ScreenLibrary() {
  const [query,setQuery]=useState('');
  const [group,setGroup]=useState(0);
  const filtered=screens.filter(s=>(!group || s.group===group) && `${s.id} ${s.title}`.toLowerCase().includes(query.toLowerCase()));
  return <SafeAreaView style={styles.page}><View style={styles.container}>
    <View style={styles.header}><Pressable accessibilityRole="button" onPress={()=>router.canGoBack()?router.back():router.replace('/screens/C1')}><Text style={styles.link}>← Back</Text></Pressable><Text style={styles.badge}>UI DEMO · 80 SCREENS</Text></View>
    <Text style={styles.title}>Every seat.{'\n'}<Text style={{color:'#2F5BFF'}}>Every screen.</Text></Text>
    <Text style={styles.subtitle}>Explore all four design boards. Forms and bookings use local demo state.</Text>
    <TextInput accessibilityLabel="Search screens" placeholder="Search by name or ID, e.g. D4" placeholderTextColor="#7A8398" value={query} onChangeText={setQuery} style={styles.input} />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flexGrow:0}} contentContainerStyle={styles.filters}>{groups.map((label,i)=><Pressable accessibilityRole="button" key={label} onPress={()=>setGroup(i)} style={[styles.chip,group===i&&styles.active]}><Text style={[styles.chipText,group===i&&{color:'#FFFFFF'}]}>{label}</Text></Pressable>)}</ScrollView>
    <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
      {filtered.map(screen=><Pressable accessibilityRole="button" accessibilityLabel={`${screen.id} ${screen.title}`} key={screen.id} style={styles.card} onPress={()=>router.push({pathname:'/screens/[id]',params:{id:screen.id}})}><View style={styles.id}><Text style={styles.idText}>{screen.id}</Text></View><View style={{flex:1,gap:4}}><Text style={styles.name}>{screen.title}</Text><Text style={styles.meta}>Board {screen.group} · {groups[screen.group]}</Text></View><Text style={styles.arrow}>↗</Text></Pressable>)}
      {!filtered.length?<Text style={styles.subtitle}>No screens match this search.</Text>:null}
      <Pressable accessibilityRole="button" style={styles.live} onPress={()=>router.push('/(auth)/login')}><Text style={styles.link}>Open existing API-connected sign-in →</Text></Pressable>
    </ScrollView>
  </View></SafeAreaView>;
}
const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:'#F4F6FB',alignItems:'center'},container:{flex:1,width:'100%',maxWidth:680,paddingHorizontal:20},header:{flexDirection:'row',justifyContent:'space-between',paddingVertical:18,alignItems:'center'},link:{color:'#2F5BFF',fontWeight:'700',fontSize:13},badge:{fontSize:10,fontWeight:'800',letterSpacing:1,color:'#5B6478'},title:{fontSize:36,fontWeight:'900',letterSpacing:-1,lineHeight:39,color:'#0A1130',marginTop:12},subtitle:{fontSize:14,lineHeight:21,color:'#5B6478',marginVertical:16},input:{height:50,borderRadius:15,borderWidth:1,borderColor:'#E3E7F1',paddingHorizontal:16,backgroundColor:'#FFFFFF',fontSize:14,color:'#0A1130'},filters:{gap:8,paddingVertical:18},chip:{paddingVertical:10,paddingHorizontal:15,borderRadius:99,backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E3E7F1'},active:{backgroundColor:'#0A1130',borderColor:'#0A1130'},chipText:{fontSize:12,fontWeight:'700',color:'#4A5368'},list:{gap:10,paddingBottom:24},card:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#E3E7F1',borderRadius:18,padding:14,flexDirection:'row',alignItems:'center',gap:14},id:{width:42,height:42,borderRadius:12,backgroundColor:'#EAF0FF',alignItems:'center',justifyContent:'center'},idText:{fontWeight:'800',fontSize:14,color:'#2F5BFF'},name:{fontWeight:'700',fontSize:15,color:'#0A1130'},meta:{fontSize:11,color:'#7A8398'},arrow:{fontSize:20,color:'#2F5BFF'},live:{padding:18,alignItems:'center'},
});
