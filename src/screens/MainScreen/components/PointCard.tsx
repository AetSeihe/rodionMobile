import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../../../components/Button'
import { mainFont } from '../../../theme/theme'
import { FeatureMember } from '../../../types/api/yandexMap.api'



type Props = {
    point: FeatureMember,
    buttonTitle?: string,
    onPressButton?: () => void
}



export const FeaturePointCard = ({ point, buttonTitle, onPressButton }: Props) => {
    const data = point.GeoObject
    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>{data.name}</Text>
            <Text style={styles.city}>{data.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AddressLine}</Text>
            {!!buttonTitle && <Button style={styles.button} title={buttonTitle} onPress={onPressButton} />}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
    },
    title: {
        fontFamily: mainFont.bold,
        fontSize: 25,
    },
    city: {
        color: 'gray'
    },
    button: {
        marginTop: 20,
    }
})
