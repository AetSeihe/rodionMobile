import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';
import Place, {PlaceProps} from '../../../components/Place';
import {File} from '../../../models/file.model';
import {mainFont} from '../../../theme/theme';

// const CARD_OPEN_DURATION = 900;

export type GragCardButtonType = {
  title: string;
  onPress: () => void;
};

export type DragCardPropsType = {
  preview: File | null;
  title: string;
  cardsTitle: string;
  places: PlaceProps[];
  descriptions: string;
  buttons: GragCardButtonType[];
  needShowFullCard?: boolean;
  onPressCard?: () => void;
};

const DragCard = ({
  title,
  preview,
  cardsTitle,
  descriptions,
  onPressCard,
  places,
}: DragCardPropsType) => {
  return (
    <Animated.View style={[styles.wrapper]} onTouchEnd={onPressCard}>
      {preview && (
        <Animated.Image
          style={[styles.preview]}
          source={{
            uri: preview.url,
          }}
        />
      )}
      <Text style={styles.way}>Владимир- Москва</Text>
      <Text style={styles.title}>{title}</Text>
      <Animated.Text style={[styles.carcTitle]}>{cardsTitle}:</Animated.Text>
      <Animated.View>
        {places.map((place, i) => (
          <Place key={i} {...place} />
        ))}
      </Animated.View>

      <Animated.Text style={[styles.text]}>{descriptions}</Animated.Text>
      <View style={styles.line} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    top: 11,
    alignSelf: 'center',
    backgroundColor: '#E3E3E3',
    borderRadius: 5,
    width: 54,
    height: 5,
  },
  scroll: {
    maxHeight: 600,
  },
  wrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingHorizontal: 13,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
  },
  preview: {
    borderRadius: 10,
  },
  way: {
    fontSize: 20,
    fontFamily: mainFont.bold,
  },
  title: {
    fontFamily: mainFont.regular,
    fontSize: 18,
    marginBottom: 10,
  },
  carcTitle: {
    fontFamily: mainFont.regular,
  },
  text: {
    fontFamily: mainFont.regular,
  },
});

export default DragCard;
