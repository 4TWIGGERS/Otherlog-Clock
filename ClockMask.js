import React from 'react';
import { StyleSheet } from 'react-native';
import { Svg, Defs, Circle, Rect, Mask } from 'react-native-svg';

const ClockMask = ({ size, areaWidth, areaHeight }) => {
	return (
		<Svg width={size} height={size} style={styles.absolute}>
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
			<Circle
				r='50%'
				cx='50%'
				cy='50%'
				mask='url(#m)'
				fill-opacity='0'
				fill='#95393846'
				// fill='rgba(0, 0, 0, 0.6)'
			/>
		</Svg>
	);
};

const styles = StyleSheet.create({
	absolute: {
		position: 'absolute',
	},
});

export default ClockMask;
