import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { useFonts } from 'expo-font';

import Clock from './Clock';
import { useSharedValue } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const CLOCK_SIZE = SCREEN_WIDTH - 20;
const DEFAULT_SEC_SPEED = 1;
const DEFAULT_MIN_SPEED = 60;
const PRIMARY_COLOR = '#A9312A';

const App = () => {
   const [showOptions, setShowOptions] = useState(true);
   const [showSeconds, setShowSeconds] = useState(false);
   const [activeMultiplier, setactiveMultiplier] = useState(
      showSeconds ? DEFAULT_SEC_SPEED : DEFAULT_MIN_SPEED
   );
   const lastActiveSpeed = useRef(activeMultiplier);
   const [speedInSec, setSpeedInSec] = useState(activeMultiplier);
   const [fontSize, setFontSize] = useState(CLOCK_SIZE / 8.85);
   const restartRequested = useSharedValue(false);

   useEffect(() => {
      const m = showSeconds ? DEFAULT_SEC_SPEED : DEFAULT_MIN_SPEED;
      setactiveMultiplier(m);
      setSpeedInSec(m);
      lastActiveSpeed.current = m;
      setFontSize(showSeconds ? CLOCK_SIZE / 12.5 : CLOCK_SIZE / 8.85);
   }, [showSeconds]);

   const [fontsLoaded] = useFonts({
      'Gill-Sans-Medium': require('./assets/fonts/Gill-Sans-Medium.otf'),
   });

   return (
      <View style={styles.container}>
         {fontsLoaded ? (
            <>
               {showOptions && (
                  <View style={styles.options}>
                     <View style={styles.row}>
                        <TouchableOpacity
                           onPress={() => {
                              restartRequested.value = true;
                              setSpeedInSec(lastActiveSpeed.current);
                           }}
                           style={styles.button}>
                           <Text style={styles.label}>restart</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={styles.row}>
                        <TouchableOpacity
                           onPress={() => {
                              lastActiveSpeed.current = speedInSec;
                              setSpeedInSec(0);
                           }}
                           style={styles.button}>
                           <Text style={styles.label}>pause</Text>
                        </TouchableOpacity>
                        <View style={styles.gap} />
                        <TouchableOpacity
                           onPress={() => setSpeedInSec(lastActiveSpeed.current)}
                           style={styles.button}>
                           <Text style={styles.label}>resume</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={styles.row}>
                        <TouchableOpacity
                           onPress={() => setShowSeconds((s) => !s)}
                           style={[
                              styles.button,
                              {
                                 backgroundColor: showSeconds ? PRIMARY_COLOR : 'transparent',
                              },
                           ]}>
                           <Text
                              style={[
                                 styles.label,
                                 {
                                    color: showSeconds ? '#fff' : PRIMARY_COLOR,
                                 },
                              ]}>
                              include seconds
                           </Text>
                        </TouchableOpacity>
                     </View>
                     <View style={styles.row}>
                        <TouchableOpacity
                           onPress={() => {
                              lastActiveSpeed.current = speedInSec - activeMultiplier;
                              setSpeedInSec((s) => s - activeMultiplier);
                           }}
                           style={styles.button}>
                           <Text style={styles.label}>decrement</Text>
                        </TouchableOpacity>
                        <Text style={[styles.label, styles.speed]}>{speedInSec}x</Text>
                        <TouchableOpacity
                           onPress={() => {
                              lastActiveSpeed.current = speedInSec + activeMultiplier;
                              setSpeedInSec((s) => s + activeMultiplier);
                           }}
                           style={styles.button}>
                           <Text style={styles.label}>increment</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               )}
               <Clock
                  minutesOnly={!showSeconds}
                  clockSize={CLOCK_SIZE}
                  fontSize={fontSize}
                  reelBorderWidth={1}
                  speedInSecs={speedInSec}
                  restartRequested={restartRequested}
                  color={PRIMARY_COLOR}
               />
            </>
         ) : null}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#DBDBD9',
      paddingHorizontal: (SCREEN_WIDTH - CLOCK_SIZE) / 2,
   },
   options: {
      position: 'absolute',
      top: 50,
      width: '100%',
      alignItems: 'center',
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
   },
   button: {
      flexGrow: 1,
      paddingVertical: 5,
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: PRIMARY_COLOR,
   },
   gap: {
      marginHorizontal: 10,
   },
   label: {
      fontFamily: 'Gill-Sans-Medium',
      fontSize: 15,
      color: PRIMARY_COLOR,
      textAlignVertical: 'center',
      ...Platform.select({
         ios: {
            lineHeight: 15, // as same as height
         },
         android: {},
      }),
      textTransform: 'uppercase',
   },
   speed: {
      paddingHorizontal: 10,
      fontSize: 20,
      fontWeight: 'bold',
      textAlignVertical: 'center',
      ...Platform.select({
         ios: {
            lineHeight: 20, // as same as height
         },
         android: {},
      }),
   },
});

export default App;
