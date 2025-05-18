import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screen/HomeScreen';
import ExplorarScreen from '../Screen/ExplorarScreen';
import HistoriaScreen from '../Screen/HistoriaScreen';
import RutasScreen from '../Screen/RutasScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#28A745',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'black',
          height: 60,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          switch (route.name) {
            case 'Inicio':
              iconName = 'home-outline';
              break;
            case 'Explorar':
              iconName = 'compass-outline';
              break;
            case 'Historia':
              iconName = 'book-outline';
              break;
            case 'Rutas':
              iconName = 'map-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Explorar" component={ExplorarScreen} />
      <Tab.Screen name="Historia" component={HistoriaScreen} />
      <Tab.Screen name="Rutas" component={RutasScreen} />
    </Tab.Navigator>
  );
}
