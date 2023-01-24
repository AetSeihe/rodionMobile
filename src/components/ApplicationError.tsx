import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colorTheme, mainFont} from '../theme/theme';

type Props = {
  title: string;
  text: string;
  onPress: () => void;
};

const ApplicationError = ({text, title, onPress}: Props) => {
  return (
    <View style={styles.wrapper} onTouchStart={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colorTheme.error,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: mainFont.bold,
    fontSize: 13,
    color: '#fff',
  },
  text: {
    fontFamily: mainFont.light,
    fontSize: 10,
    color: '#fff',
  },
});

export default ApplicationError;
