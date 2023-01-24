import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {File} from '../models/file.model';
import {mainFont} from '../theme/theme';

export type PlaceProps = {
  preview: File | null;
  title: string;
  shortText: string;
  onPress: () => void;
};

const Place = ({preview, title, onPress}: PlaceProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      {preview && (
        <View style={styles.backgroundWrapper}>
          <Image
            resizeMode="cover"
            style={styles.backgroundImage}
            source={{
              uri: preview.url,
            }}
          />
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'red',
  },
  backgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    zIndex: -1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  title: {
    marginVertical: 20,
    marginLeft: 15,
    color: '#fff',
    fontFamily: mainFont.regular,
  },
});

export default Place;
