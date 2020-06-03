import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon } from 'react-native-elements'
import RestaurantsStack from "./RestaurantsStack"
import FavoritesStack from "./FavoritesStack"
import TopRestaurantsStack from "./TopRestaurantsStack"
import SearchStack from "./SearchStack"
import AccountStack from "./AccountStack"

const Tab = createBottomTabNavigator()

export default function Navigation() {

    const colorIcon = () => {
       console.log('aaa')
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="restaurants"
                tabBarOptions={{ 
                    inactiveTintColor: "#D8D8D8",
                    activeTintColor: "#000000",
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, focused }) => screenOptions(route, color, focused),                      
                }) 
            }
            >
                <Tab.Screen 
                    name="restaurants" 
                    component={RestaurantsStack} 
                    options={{ title: "Platillos" }} 
                />
                <Tab.Screen 
                    name="favorites" 
                    component={FavoritesStack} 
                    options={{ title: "Favoritos" }} 
                    
                />
                <Tab.Screen 
                    name="top-restaurants" 
                    component={TopRestaurantsStack} 
                    options={{ title: "Top 10"}} 
                />
                <Tab.Screen 
                    name="search" 
                    component={SearchStack} 
                    options={{ title: "Buscar"}} 
                />
                <Tab.Screen 
                    name="account" 
                    component={AccountStack} 
                    options={{ title: "Perfil"}} 
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}




function screenOptions(route, color, focused) {
console.log(focused)
    let iconName

    switch (route.name) {
        case "restaurants":
            iconName = "food-apple"
            color="#09AC10"
            break;
        case "favorites":
            iconName = "heart-multiple"
            color="#D31C4B"
            break;
        case "top-restaurants":
            iconName = "star-face"
            color="#E8D707"
            break;
        case "search":
            iconName = "magnify"
            color="#E25C04"
            break;
        case "account":
            iconName = "account-circle"
            color="#0981BD"
            break;
        default:
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={25} style={{  }} color={focused ? color : "#D8D8D8"}  />
    )
}