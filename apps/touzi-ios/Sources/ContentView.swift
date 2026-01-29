import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            TripsView()
                .tabItem { Label("旅行", systemImage: "airplane") }

            CheckInView()
                .tabItem { Label("签到", systemImage: "checkmark.circle") }

            SettingsView()
                .tabItem { Label("设置", systemImage: "gearshape") }
        }
    }
}

#Preview {
    ContentView()
}
