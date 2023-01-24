import React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {colorTheme, mainFont} from '../theme/theme';

type Props = {
  title: string;
  loading?: boolean;
  textStyle?: TextStyle;
};

const Button = ({
  title,
  style,
  loading,
  textStyle,
  ...props
}: Props & TouchableOpacityProps) => {
  return (
    <TouchableOpacity
      style={[styles.wrapper, loading ? styles.loading : {}, style]}
      disabled={loading}
      {...props}>
      <Text style={[styles.text, textStyle]}>
        {loading ? 'Зарузка...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 16,
    borderRadius: 8.5,
    backgroundColor: colorTheme.main,
  },
  text: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: mainFont.bold,
    color: '#fff',
    letterSpacing: 0.5,
  },
  loading: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.9,
      },
    ],
  },
});

export default Button;
