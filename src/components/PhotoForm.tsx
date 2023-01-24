import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Asset} from 'react-native-image-picker';
import Animated, {FadeOut} from 'react-native-reanimated';
import {noPhotoUserImage} from '../images';
import {colorTheme, mainFont} from '../theme/theme';

type Props = {
  image?: Asset | null;
  wrapperStyle?: ViewStyle;
  loading?: boolean;
  onPress: () => void;
};

const AddPhotoForm = ({image, onPress, loading, wrapperStyle}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.wrapper, loading ? styles.disabledForm : {}, wrapperStyle]}
      disabled={loading}>
      <View>
        <Image
          source={image || noPhotoUserImage}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      {!image && (
        <Animated.Text exiting={FadeOut} style={styles.text}>
          Добавить фотографию
        </Animated.Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  disabledForm: {
    opacity: 0.4,
  },
  image: {
    width: 123,
    height: 123,
    marginBottom: 15,
    borderRadius: 12,
  },

  text: {
    fontFamily: mainFont.bold,
    color: colorTheme.main,
    fontSize: 13,
  },
});

export default AddPhotoForm;
