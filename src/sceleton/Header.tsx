import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {HEADER_HEIGHT} from '../constants/app';
import {LogoImage} from '../images';

const Header = () => {
  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <Image style={styles.image} source={LogoImage} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 13,
    paddingVertical: 20,
  },
  image: {
    width: 151,
    height: 35,
  },
});

export default Header;
