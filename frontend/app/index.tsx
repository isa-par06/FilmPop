import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import app from "../lib/firebase";

export default function Index() {
  const [firebaseStatus, setFirebaseStatus] = useState("Initializing...");

  useEffect(() => {
    // Test Firebase connection
    if (app) {
      setFirebaseStatus("Firebase connected successfully!");
    } else {
      setFirebaseStatus("Firebase connection failed");
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
