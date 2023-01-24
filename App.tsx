import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  FlipInXUp,
  Layout,
  SlideOutRight,
} from 'react-native-reanimated';
import ApplicationError from './src/components/ApplicationError';
import {onEnterApp} from './src/global/onEnterApp';
import MainNavigator from './src/navigators/MainNavigator';
import {applicationStore} from './src/store/applicationStore';
import YaMap from 'react-native-yamap';
import {MAP_API_KEY} from './src/constants/root';

YaMap.init(MAP_API_KEY);

const App = () => {
  const [loading, setLoading] = useState(true);
  const init = async () => {
    await onEnterApp();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <MainNavigator />
      <Animated.View style={styles.errorsWrapper} layout={Layout.springify()}>
        {applicationStore.errors.map((item, index) => (
          <Animated.View
            layout={Layout.springify()}
            key={item.index}
            style={styles.errorItem}
            entering={FlipInXUp.springify()}
            exiting={SlideOutRight.springify()}>
            <ApplicationError
              title={item.title}
              text={item.text}
              onPress={() => applicationStore.deleteError(index)}
            />
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorsWrapper: {
    flex: 1,
    position: 'absolute',
    top: 20,
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  errorItem: {
    marginBottom: 10,
  },
});

export default observer(App);
