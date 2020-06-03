import React, { useRef } from "react"
import { StyleSheet, View, ScrollView, Image, Text } from "react-native"
import { Divider } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-easy-toast"
import LoginForm from "../../components/Account/LoginForm"
import LoginFacebook from "../../components/Account/LoginFacebook"

export default function Login() {
    const toastRef = useRef()

    return (
        <ScrollView>
            <Image
                source={require("../../../assets/img/logo.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm toastRef={toastRef} />
                <CreateAccount />
                </View>
                <Divider style={styles.divider} />
                <View style={styles.viewContainer}>
                    <LoginFacebook toastRef={toastRef} />
                </View>
                <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    )
}

function CreateAccount() {
    const navigation = useNavigation()
    return (
        <Text style={styles.textRegister}>
            ¿Aún no estas registrado? {" "}
            <Text 
                style={styles.btnRegister}
                onPress={() => navigation.navigate("register")}
            >
                Regístrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 200,
        marginTop: 20
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
    textRegister: {
       marginTop: 15,
       marginLeft: 10,
       marginRight: 10, 
    },
    btnRegister: {
        color: "#08A6D0",
        fontWeight: "bold"
    },
    divider: {
        backgroundColor: "#08A6D0",
        margin: 40
    }
})