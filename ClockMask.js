import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Svg, Defs, Circle, Rect, Mask } from 'react-native-svg';

const Grid = ({ size, strokeWidth, strokeGap, color }) => {
   const strokeFullWidth = strokeWidth + strokeGap;
   return (
      <View style={[styles.gridContainer, { width: size, height: size, borderRadius: size / 2 }]}>
         {[...Array(Math.round(size / strokeFullWidth)).keys()].map((_, index) => {
            return (
               <View
                  key={index}
                  style={{
                     position: 'absolute',
                     height: size,
                     width: strokeWidth,
                     backgroundColor: color,
                     left: strokeFullWidth * index,
                  }}
               />
            );
         })}
      </View>
   );
};

const ClockMask = ({
   size = 1,
   areaWidth = 1,
   areaHeight = 1,
   strokeGap = 5,
   strokeWidth = 1,
   color,
}) => {
   return (
      <Svg width={size} height={size} style={styles.container}>
         <Defs>
            <Mask id='m' x='0' y='0' height='100%' width='100%'>
               <Circle r='50%' cx='50%' cy='50%' fill='#fff' />
               <Rect
                  x={size / 2}
                  y={size / 2 - areaHeight / 2}
                  rx={areaHeight / 2}
                  width={areaWidth}
                  height={areaHeight}
                  fill='#000'
               />
            </Mask>
         </Defs>
         <Grid size={size} strokeWidth={strokeWidth} strokeGap={strokeGap} color={color} />
         <Rect
            x={size / 2}
            y={size / 2 - areaHeight / 2}
            rx={areaHeight / 2}
            width={areaWidth}
            height={areaHeight}
            fill='transparent'
            stroke={color}
            strokeWidth={strokeWidth}
         />
         <Circle
            r='50%'
            cx='50%'
            cy='50%'
            mask='url(#m)'
            fillOpacity={0.25}
            fill={color}
            stroke={color}
            strokeWidth={3 * strokeWidth}
         />
      </Svg>
   );
};

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      overflow: 'hidden',
   },
   gridContainer: {
      overflow: 'hidden',
   },
});

export default ClockMask;
