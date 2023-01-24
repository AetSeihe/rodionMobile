import React, {useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import MaskInput, {MaskInputProps} from 'react-native-mask-input';
import Animated, {FadeIn, FadeOut, Layout} from 'react-native-reanimated';
import {colorTheme, mainFont} from '../theme/theme';

type Props = {
  label?: string;
  icon?: ImageSourcePropType;
  error?: string;
  secret?: boolean;
  wrapperStyle?: ViewStyle;
};

const InputField = ({
  icon,
  label,
  error,
  wrapperStyle,
  style,
  secret,
  ...props
}: Props & MaskInputProps) => {
  const [visibleField, setVisibleField] = useState(secret);

  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      {!!label && (
        <View style={styles.labelWrapper}>
          {icon && (
            <Image style={styles.icon} source={icon} resizeMode="contain" />
          )}
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      <View style={styles.inputWrapper}>
        <MaskInput
          style={[styles.input, style]}
          selectionColor={colorTheme.main}
          spellCheck={false}
          cursorColor={colorTheme.main}
          secureTextEntry={visibleField}
          {...props}
          caretHidden={false}
        />
        {secret && (
          <Text
            style={styles.secretText}
            onPress={() => setVisibleField(!visibleField)}>
            {visibleField ? 'Посмотреть' : 'Скрыть'}
          </Text>
        )}
      </View>
      {error && (
        <Animated.Text
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.error}
          layout={Layout.springify().delay(200)}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -5,
  },
  label: {
    fontFamily: mainFont.bold,
    fontSize: 13,
    color: colorTheme.sub,
    marginBottom: -2,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
    marginLeft: -5,
  },
  inputWrapper: {
    position: 'relative',
  },
  secretText: {
    fontSize: 13,
    fontFamily: mainFont.regular,
    color: colorTheme.main,
    position: 'absolute',
    right: 0,
    top: '20%',
  },
  input: {
    color: colorTheme.text,
    fontFamily: mainFont.bold,
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: colorTheme.sub,
    borderColor: colorTheme.text,
  },
  error: {
    fontFamily: mainFont.light,
    fontSize: 13,
    color: colorTheme.error,
  },
});

export default InputField;
