import React from "react"
import { 
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from "react-native"
import { Image, Icon } from "react-native-elements"
import { size } from "lodash"
import { useNavigation } from "@react-navigation/native"

export default function ListRestaurants(props){
    const { restaurants, handleLoadMore, isLoading } = props
    const navigation = useNavigation()

    return (
        <View>
            {size(restaurants) > 0 ? (
                <FlatList
                    numColumns={3}
                    data={restaurants}
                    renderItem={ (restaurant) => <Restaurant restaurant={restaurant} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando platillos</Text>
                </View>
            )}
        </View>
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props
    const { id, images, name, address, restaurantName } = restaurant.item
    const imageRestaurant = images ? images[0] : null

    const goRestaurant = () => {
        navigation.navigate("restaurant", {
            id,
            name
        })
    }
    
    return (
        <TouchableOpacity onPress={goRestaurant} style={styles.container}>
            <View style={styles.viewImages}>
            <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff" />}
                        source={
                            imageRestaurant
                                ? { uri: imageRestaurant }
                                : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imageRestaurant}
                    />
                <View style={styles.viewTextImage}>
                    <View style={styles.containerText}>
                        <Text style={styles.restaurantName}>{size(name) >= 30 ? name.substr(0, 30)+'...' : name}</Text>
                        <Text style={styles.restaurantAddress}>{restaurantName}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList(props) {
    const { isLoading } = props

    if(isLoading) {
        return (
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large" color="#42A142" />
            </View>
        )
    } else {
        return (
            
            <View style={styles.notFoundRestaurants}>
                <Text style={styles.textNotFound}>No quedan más platillos por cargar</Text>
            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        flex: 1,
    },
    viewImages:{
        margin: 1,
    },
    viewTextImage: {
        position: "absolute",
        bottom: 0,
        zIndex: 1,
        backgroundColor: "rgba(10,10,10,0.6)",
        width: "100%",
        maxHeight: 80
    },
    containerText: {
        margin: 2
    },
    loaderRestaurants: {
        marginTop:10,
        marginBottom: 10,
        alignItems: "center",
    },
    viewRestaurant: {
        flexDirection: "row",
        margin: 10,
    },
    viewRestaurantImage: {
      marginRight: 15,  
    },
    imageRestaurant: {
        width: "100%",
        height: 170,
    },
    restaurantName: {
        fontWeight: "bold",
        color: "#D7D7D7",
        marginLeft: 2
    },
    restaurantAddress: {
        paddingTop: 2,
        color: "#D7D7D7",
        marginLeft: 1
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300,
    },
    notFoundRestaurants: {
        marginTop: 5,
        marginBottom: 20,
        alignItems: "center",
    },
    textNotFound: {
        color: "grey",
    }
})