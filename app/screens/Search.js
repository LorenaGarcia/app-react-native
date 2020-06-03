import React,  { useState, useEffect } from "react"
import { StyleSheet, View, Text, FlatList, Image } from "react-native"
import { SearchBar, ListItem, Icon, Rating } from "react-native-elements"
import { FireSQL } from "firesql"
import firebase from "firebase/app"

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" })

export default function Search(props) {
    const { navigation } = props;
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if (search) {
          fireSQL
            .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%' OR restaurant LIKE '${search}%'`)
            .then((response) => {
              setRestaurants(response)
            })
        }
      }, [search])

    return (
        <View>
            <SearchBar
                placeholder="Buscar..."
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar}
            />
            {restaurants.length === 0 && !search && (
                <NoFoundRestaurants />
            )}
            {restaurants.length === 0 && search ? (
                 <View>
                     <Text>No se encontraron resultados</Text>
                 </View>
            ) : (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    )
}

function NoFoundRestaurants() {
    return (
      <View style={styles.ContainerNoFound}>
        <Image
          source={require("../../assets/img/no-result-found.png")}
          resizeMode="cover"
          style={styles.imageNoFound}
        />
      </View>
    );
  }

function Restaurant(props) {
    const { restaurant, navigation } = props
    const { id, name, images, rating, address } = restaurant.item

    return (
        <ListItem
            title={name}
            subtitle={
                <View style={{ alignItems: "flex-start" }} >
                  <Text>{address}</Text>
                  <Rating
                    imageSize={10}
                    startingValue={rating}
                    readonly
                />
                </View>
              }
            leftAvatar={{
                source: images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")
            }}
            rightIcon={<Icon type="material-community" name="chevron-right" />}
            onPress={() => navigation.navigate("restaurants", { screen: "restaurant", params: {id, name} })}
        />
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20
    },
    ContainerNoFound: {
        flex: 1,
        alignItems: "center"
    },
    imageNoFound: {
        width: 200,
        height: 200,
    }
})