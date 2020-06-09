import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { Text, View, Image } from "react-native"
import Restaurants from "../screens/Restaurants/Restaurants"
import AddRestaurant from "../screens/Restaurants/AddRestaurant"
import Restaurant from "../screens/Restaurants/Restaurant"
import AddReviewRestaurant from "../screens/Restaurants/AddReviewRestaurant"

const Stack = createStackNavigator()

export default function RestaurantsStack() {

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{
                    title: " ",
                    headerTintColor: 'white', 
                    header: props => <Header {...props} />,
                  }}
            />
            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurant}
                options={{
                    title: " ",
                    headerTintColor: 'white', 
                    header: props => <Header home={false} {...props} />,
                  }}
                // options={{ title: "Añadir nuevo platillo" }}
            />
            <Stack.Screen
                name="restaurant"
                component={Restaurant}
            />
            <Stack.Screen
                name="add-review-restaurant"
                component={AddReviewRestaurant}
                options={{ title: "Nuevo comentario" }}
            />
        </Stack.Navigator>
    )
}




const Header = (props, home) => (
    <View style={{ backgroundColor: "transparent" }}>
      <Image
        style={{width: "100%", height: 90, position: 'absolute', top: 0, left: 0}}
        source={ require("../../assets/img/header-green.jpg") }
        resizeMode="cover"
      />
    </View>
  );