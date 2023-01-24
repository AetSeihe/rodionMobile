import React from 'react';
import {Image, ImageProps, TouchableOpacity, ViewStyle} from 'react-native';

type Props = {
  wrapperStyle?: ViewStyle;
  onPress?: () => void;
};

const Icon = ({wrapperStyle, onPress, ...props}: Props & ImageProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={wrapperStyle}>
      <Image {...props} />
    </TouchableOpacity>
  );
};

export default Icon;
