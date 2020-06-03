import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements"
import { useFocusEffect } from "@react-navigation/native"
import Toast from "react-native-easy-toast"
import Loading from "../components/Loading"

import { firebaseApp } from "../utils/firebase"
import firebase from "firebase"
import "firebase/firestore"

const db = firebase.firestore(firebaseApp)

export default function Favorites(props) {
  const { navigation } = props
  const [restaurants, setRestaurants] = useState(null)
  const [userLogged, setUserLogged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reloadData, setReloadData] = useState(false)
  const toastRef = useRef()

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false)
  })

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idRestaurantsArray = []
            response.forEach((doc) => {
              idRestaurantsArray.push(doc.data().idRestaurant)
            })
            getDataRestaurant(idRestaurantsArray).then((response) => {
              const restuarants = []
              response.forEach((doc) => {
                const restaurant = doc.data()
                restaurant.id = doc.id
                restuarants.push(restaurant)
              })
              setRestaurants(restuarants)
            })
          })
      }
      setReloadData(false)
    }, [userLogged, reloadData])
  )

  const getDataRestaurant = (idRestaurantsArray) => {
    const arrayRestaurants = [];
    idRestaurantsArray.forEach((idRestaurant) => {
      const result = db.collection("restaurants").doc(idRestaurant).get();
      arrayRestaurants.push(result);
    });
    return Promise.all(arrayRestaurants);
  };

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (restaurants?.length === 0) {
    return <NotFoundRestaurants />;
  }

  

  return (
    <View style={styles.viewBody}>
      {restaurants ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant
              restaurant={restaurant}
              setIsLoading={setIsLoading}
              toastRef={toastRef}
              setReloadData={setReloadData}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando restaurantes</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading text="Eliinando restaurante" isVisible={isLoading} />
    </View>
  );
}

function NotFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes platillos en tu lista
      </Text>
    </View>
  );
}

function UserNoLogged(props) {
  const { navigation } = props

  return (
    <View style={styles.textAlertContainer}>
      <Icon
        type="material-community" 
        name="alert-outline" 
        size={50} 
        iconStyle={styles.iconAlert}
      />
      <Text style={styles.textAlertLogin}>
        Necesitas estar logeado para ver esta sección
      </Text>
      <Button
        title="Ir al login"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      />
    </View>
  );
}

function Restaurant(props) {
  const {
    restaurant,
    setIsLoading,
    toastRef,
    setReloadData,
    navigation,
  } = props
  const { id, name, images, restaurantName } = restaurant.item

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar Restaurante de Favoritos",
      "¿Estas seguro de que quieres eliminar el restaurante de favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = () => {
    setIsLoading(true);
    db.collection("favorites")
      .where("idRestaurant", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              toastRef.current.show("Restaurante eliminado correctamente");
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show("Error al eliminar el restaurante");
            });
        });
      });
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("restaurants", {
            screen: "restaurant",
            params: { id },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#F9F9F9"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          />
        </View>
        <View style={styles.infoRestaurant}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
    },
    restaurant: {
        margin: 10,
    },
    image: {
        width: "100%",
        height: 180
    },
    info: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 5,
        marginTop: -30,
        backgroundColor: "#fff"
    },
    infoRestaurant: {
      flex: 1,
        alignItems: "center",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        backgroundColor: "#fff"
    },
    name: {
       fontWeight: "bold",
       fontSize: 20 
    },
    restaurantName: {
      fontWeight: "bold",
      color: "grey",
    },
    favorite: {
        marginTop: -35,
        backgroundColor: "rgba(240, 29, 73, 0.7)",
        padding: 15,
        borderRadius: 100
    },
    btnContainerLogin: {
      marginTop: 20,
      width: "80%"
    },
    btnLogin: {
      backgroundColor: "#08A6D0",
      borderRadius: 10,
    },
    textAlertLogin: {
      fontSize: 15,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 40,
      marginTop: 10,
    },
    textAlertContainer: {
      flex: 1, 
      alignItems: "center",
      justifyContent: "center"
    },
    iconAlert: {
      color: "#08A6D0"
    }
})