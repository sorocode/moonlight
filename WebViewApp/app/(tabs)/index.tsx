import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: "https://moonlight-crfb.vercel.app" }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
