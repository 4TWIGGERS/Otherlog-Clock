import React from 'react';
import { StyleSheet } from 'react-native';
import { Svg, Defs, Circle, Rect, Mask, Line, G } from 'react-native-svg';
import { Shadow } from 'react-native-shadow-2';

const Grid = ({ size, strokeWidth, strokeGap, color, mask }) => {
   const strokeFullWidth = strokeWidth + strokeGap;

   return (
      <G mask={mask}>
         {[...Array(Math.round(size / strokeFullWidth)).keys()].map((_, index) => {
            return (
               <Line
                  key={index.toString()}
                  x1={strokeFullWidth * index}
                  x2={strokeFullWidth * index}
                  strokeWidth={strokeWidth}
                  y1='0'
                  y2='100%'
                  stroke={color}
               />
            );
         })}
      </G>
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
   const maskShadow = 2.5 * strokeWidth;
   const circleShadow = 5 * strokeWidth;
   const circleShadowSize = size - 2 * circleShadow;
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
         <Grid
            size={size}
            strokeWidth={strokeWidth}
            strokeGap={strokeGap}
            color={color}
            mask='url(#m)'
         />
         <Shadow
            distance={maskShadow}
            style={{
               position: 'absolute',
               width: areaWidth - 2 * maskShadow,
               height: areaHeight - 2 * maskShadow,
               borderRadius: areaHeight / 2,
            }}
            offset={[size / 2 + maskShadow, size / 2 - areaHeight / 2 + maskShadow]}
            startColor={'#0000'}
            endColor={`${color}80`}
         />
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
         <Shadow
            distance={circleShadow}
            style={{
               position: 'absolute',
               width: circleShadowSize,
               height: circleShadowSize,
               borderRadius: size,
            }}
            offset={[circleShadow, circleShadow]}
            startColor={'#0000'}
            endColor={`${color}cc`}
         />
         <Circle
            r='50%'
            cx='50%'
            cy='50%'
            mask='url(#m)'
            fillOpacity={0.25}
            fill={color}
            stroke={color}
            strokeWidth={3.5 * strokeWidth}
         />
      </Svg>
   );
};

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      overflow: 'hidden',
   },
});

export default ClockMask;
