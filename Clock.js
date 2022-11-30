import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
   Easing,
   useAnimatedStyle,
   useDerivedValue,
   useSharedValue,
   withRepeat,
   withSpring,
   withTiming,
} from 'react-native-reanimated';

import ClockMask from './ClockMask';

const getClockData = (minutesOnly = true) => {
   const hhmm = [10, 6, 10, 3];
   const hhmmss = [10, 6, 10, 6, 10, 3];

   const data = minutesOnly ? hhmm : hhmmss;
   const base = 1.4;

   return data.map((l, i) => {
      const offset = i < 2 ? base : i < 4 ? base + 1 : base + 2;
      const gapOffset = i === 2 ? base : i === 4 ? base + 1 : 0;
      return {
         data: [...Array(l).keys()],
         offset,
         gapOffset,
         isReversed: i !== 0 && i % 2 === 0,
      };
   });
};

const toHMS = (secs) => {
   'worklet';
   const pad = (n) => `0${n}`.slice(-2).split('').reverse();
   const h = pad(Math.floor((secs / 3600) % 24));
   const m = pad(Math.floor(secs / 60) % 60);
   const s = pad(secs % 60);
   return [...s, ...m, ...h];
};

const EmptyReel = ({ clockSize, boxSize, reelIndex, reelBorderWidth, extraOffset }) => {
   const reelSize = clockSize - 2 * boxSize * reelIndex - extraOffset;

   return (
      <Animated.View
         style={[
            styles.reelWrapper,
            {
               width: reelSize,
               height: reelSize,
               transform: [{ translateX: -reelSize / 2 }, { translateY: -reelSize / 2 }],
               borderRadius: clockSize,
               borderWidth: reelBorderWidth,
            },
         ]}
      />
   );
};

const Reel = ({
   reelIndex,
   reelData,
   clockSize,
   boxSize,
   fontSize,
   currTime,
   reelBorderWidth,
   minutesOnly,
}) => {
   const isReversed = reelData.isReversed;
   const extraOffset = reelData.offset * boxSize;
   const reelSize = clockSize - 2 * boxSize * reelIndex - extraOffset;
   const boxOffset = reelSize / 2 - boxSize / 2 - reelBorderWidth;
   const reelCircumference = 2 * Math.PI * ((reelSize - 2 * boxSize) / 2);
   const maxBoxCount = Math.round(reelCircumference / boxSize);
   const reelBoxCount = reelData.data.length;
   const boxAngle = 360 / ((maxBoxCount + reelBoxCount) / 2);

   const angle = useDerivedValue(() => {
      let angle = currTime.value[reelIndex + (minutesOnly ? 2 : 0)] * boxAngle;
      angle = isReversed ? angle : -angle;
      return withSpring(angle, { damping: 18, stiffness: 110 });
   });

   const reelWrapperStyle = useAnimatedStyle(() => {
      return {
         width: reelSize,
         height: reelSize,
         transform: [
            { translateX: -reelSize / 2 },
            { translateY: -reelSize / 2 },
            {
               rotate: `${angle.value}deg`,
            },
         ],
         borderRadius: clockSize,
         borderWidth: reelBorderWidth,
      };
   });

   return (
      <Animated.View style={[styles.reelWrapper, reelWrapperStyle]}>
         {reelData.data.map((value, valueIndex) => {
            return (
               <Animated.View
                  key={valueIndex.toString()}
                  style={[
                     styles.boxWrapper,
                     {
                        top: boxOffset,
                        left: boxOffset,
                        width: boxSize,
                        height: boxSize,
                        transform: [
                           {
                              rotate: `${(isReversed ? -boxAngle : boxAngle) * valueIndex}deg`,
                           },
                           { translateX: boxOffset },
                        ],
                     },
                  ]}>
                  <Animated.Text style={[styles.textBox, { fontSize: fontSize }]}>
                     {value}
                  </Animated.Text>
               </Animated.View>
            );
         })}
      </Animated.View>
   );
};

const Clock = ({
   clockSize = 350,
   minutesOnly = false,
   reelBorderWidth = 1,
   fontSize = 30,
   speedInSecs = 1,
   restartRequested,
   color = '#fff',
}) => {
   const reelData = getClockData(minutesOnly);
   const boxSize = fontSize * 0.7;
   const tick = useSharedValue(0);
   const progress = useSharedValue(0);
   const hms = useSharedValue([...Array(6).fill(0)]);

   useEffect(() => {
      tick.value = withRepeat(
         withTiming(1, { duration: 1000, easing: Easing.linear }, () => {
            if (restartRequested.value) {
               progress.value = 0;
               hms.value = toHMS(0);
               restartRequested.value = false;
            } else {
               progress.value += speedInSecs;
               hms.value = toHMS(progress.value);
            }
         }),
         -1
      );
   }, [speedInSecs]);

   return (
      <View
         style={[styles.wrapper, { width: clockSize, height: clockSize, borderRadius: clockSize }]}>
         {reelData.map((_data, reelIndex) => {
            const extraOffset = _data.offset * boxSize;
            const gapReelOffset = _data.gapOffset * boxSize;
            const shouldRenderGapReel = reelIndex === 2 || reelIndex === 4;
            return (
               <View key={reelIndex.toString()}>
                  <Reel
                     reelIndex={reelIndex}
                     reelData={_data}
                     clockSize={clockSize}
                     boxSize={boxSize}
                     fontSize={fontSize}
                     currTime={hms}
                     extraOffset={extraOffset}
                     reelBorderWidth={reelBorderWidth}
                     minutesOnly={minutesOnly}
                  />
                  {shouldRenderGapReel && (
                     <EmptyReel
                        reelIndex={reelIndex}
                        clockSize={clockSize}
                        boxSize={boxSize}
                        extraOffset={gapReelOffset}
                        reelBorderWidth={reelBorderWidth}
                     />
                  )}
               </View>
            );
         })}
         <ClockMask
            size={clockSize}
            areaWidth={clockSize / 2 - (boxSize * 2) / 5}
            areaHeight={boxSize * 1.4}
            strokeGap={clockSize / 48}
            strokeWidth={3}
            color={color}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   wrapper: {
      position: 'absolute',
      top: 230,
      alignItems: 'center',
      justifyContent: 'center',
   },
   reelWrapper: {
      position: 'absolute',
      borderColor: '#463C38',
   },
   boxWrapper: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
   },
   textBox: {
      position: Platform.OS === 'android' ? 'absolute' : 'relative',
      fontFamily: 'Gill-Sans-Medium',
      color: '#242423',
   },
});

export default Clock;
