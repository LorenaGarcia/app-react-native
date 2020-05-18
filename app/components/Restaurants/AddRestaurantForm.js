import React from "react"
import { StyleSheet, View, ScrollView, Dimensions, Text } from "react-native"
import { Icon, Avatar, Image, Input, Button } from "react-native-elements"

export default function AddRestaurantForm() {
    return (
        <ScrollView style={styles.scrollView}>
            <FormAdd />
        </ScrollView>
    )
}

function FormAdd(props) {
    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
            />
            <Input
                placeholder="Dirección"
                containerStyle={styles.input}
            />
            <Input
                placeholder="Descripción del restaurante"
                multiline={true}
                inputContainerStyle={styles.textArea}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input:{
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    }
})