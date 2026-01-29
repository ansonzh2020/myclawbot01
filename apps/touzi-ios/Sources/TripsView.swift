import SwiftUI

struct TripsView: View {
    var body: some View {
        NavigationStack {
            ContentUnavailableView("旅行", systemImage: "airplane", description: Text("v1.0 将提供本地旅行与支出记录。"))
                .navigationTitle("旅行")
        }
    }
}

#Preview {
    TripsView()
}
