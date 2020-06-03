import React, { useState, useEffect, useCallback, useRef } from "react"
import { StyleSheet, Text, View, ScrollView, Dimensions, SafeAreaView } from "react-native"
import { map } from "lodash"
import { Rating, ListItem, Icon } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"
import Carousel from "../../components/Carousel"
import Map from "../../components/Map"
import ListReviews from "../../components/Restaurants/ListReviews"

import { firebaseApp } from "../../utils/firebase"
import firebase from "firebase/app"
import "firebase/firestore"

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get("window").width

export default function Restaurant(props) {
    const { navigation, route } = props
    const { id, name } = route.params
    const [restaurant, setRestaurant] = useState(null)
    const [rating, setRating] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const toastRef = useRef()

    navigation.setOptions({ title: name })

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants")
                .doc(id)
                .get()
                .then((response) => {
                    const data = response.data()
                    data.id = response.id
                    setRestaurant(data)
                    setRating(data.rating)
                })
        }, [])
    )

    useEffect(() => {
        if(userLogged && restaurant) {
            db.collection("favorites")
                .where("idRestaurant", "==", restaurant.id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    if(response.docs.length === 1) {
                        setIsFavorite(true)
                    }
                })
        }
    }, [userLogged, restaurant])

    const addFavorite = () => {
        if(!userLogged) {
            toastRef.current.show("Inicia sesión para agregar favoritos")
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idRestaurant: restaurant.id
            }
            db.collection("favorites")
                .add(payload)
                .then(() => {
                    setIsFavorite(true)
                    toastRef.current.show("Añadido a favoritos")
                })
                .catch(() => {
                    toastRef.current.show("Error al añadir a favoritos")
                })
        }
    }

    const removeFavorite = () => {
        db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
            response.forEach((doc) => {
                const idFavorite = doc.id
                db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                    setIsFavorite(false)
                    toastRef.current.show("Eliminado de favoritos")
                })
                .catch(() => {
                    toastRef.current.show("Error al eliminar de favoritos")
                })
            })
        })
    }

    if(!restaurant) return (<Loading isVisible={true} text="Cargando..." />)

    return (
        <ScrollView vertical style={styles.viewBody}>
            <SafeAreaView style={{flex: 1, backgroundColor:'rgba(24, 16, 16, 0.3)', paddingTop: 10, paddingBottom:10 }}>
                <View style={{ flex: 1, flexDirection:'row',  }}>
                    <View style={styles.viewFavorites}>
                        <Icon
                            type="material-community"
                            name={isFavorite ? "heart" : "heart-outline"}
                            onPress={isFavorite ? removeFavorite : addFavorite}
                            color={isFavorite ? "rgba(240, 29, 73, 0.7)" : "#000"}
                            size={30}
                            underlayColor="transparent"
                        />
                    </View>
                    <Carousel
                        arrayImages={restaurant.images}
                        height={250}
                        width={screenWidth}
                    />
                </View>
            </SafeAreaView>
            <TitleRestaurant
                name={restaurant.name}
                restaurantName={restaurant.restaurantName}
                description={restaurant.description}
                rating={rating}
            />
            <RestaurantInfo
                location={restaurant.location}
                name={restaurant.name}
                address={restaurant.address}
            />
            <ListReviews
                navigation={navigation}
                idRestaurant={restaurant.id}
            />
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </ScrollView>
    )
}

function TitleRestaurant(props) {
    const { name, description, rating, restaurantName } = props

    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <View style={styles.containerIcon}>
                    <Icon
                        type="material-community"
                        name="silverware-fork-knife"
                        color='grey'
                        size={20}
                    />
                    <Text style={styles.restaurantName}>{'  '}{restaurantName}</Text>
            </View>
        <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    )
}

function RestaurantInfo(props) {
    const { location, name, address } = props

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action: null
        }
    ]
    
    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>
                Dirección del restaurante
            </Text>
            <Map
                location={location}
                name={name}
                height={100}
            />
            {map(listInfo, (item, index) => (
                <ListItem
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: "#08A6D0"
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}

const styles= StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewRestaurantTitle: {
        padding: 15,
    },
    nameRestaurant: {
        fontSize: 20,
        fontWeight: "bold",
    },
    containerIcon: {
        flexDirection: "row",
        marginTop: 5,
    },
    restaurantName: {
        fontSize: 15,
     },
    descriptionRestaurant: {
       marginTop: 5,
       color: "grey"
    },
    rating: {
        position: "absolute",
        right: 0,
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 25,
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    containerListItem : {
        borderBottomColor: "#d8d8d8",
        borderBottomWidth: 1,
    },
    viewFavorites: {
       position: "absolute",
       top: 0,
       right: 0,
       zIndex: 2,
       backgroundColor: "rgba(253, 253, 253, 0.8)",
       borderBottomLeftRadius: 100,
       padding: 5,
       paddingLeft: 15
    }
})