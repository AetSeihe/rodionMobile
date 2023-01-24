import React from 'react';
import {StyleSheet, View} from 'react-native';
import Map from '../../components/Map';
import {SearchFormObservered} from '../../components/SearchForm';

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      <SearchFormObservered />
      <Map style={styles.map} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default HomeScreen;
