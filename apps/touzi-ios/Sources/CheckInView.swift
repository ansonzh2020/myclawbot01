import SwiftUI
import CoreLocation

final class CheckInViewModel: NSObject, ObservableObject, CLLocationManagerDelegate {
    @Published var lastCheckIn: Date?
    @Published var shareMode: LocationShareMode = .approx
    @Published var statusText: String = ""

    private let manager = CLLocationManager()

    override init() {
        super.init()
        manager.delegate = self
    }

    func requestLocationIfNeededAndCheckIn() {
        let now = Date()

        switch shareMode {
        case .none:
            lastCheckIn = now
            statusText = "已签到（未包含位置）"
        case .approx, .precise:
            manager.requestWhenInUseAuthorization()
            manager.requestLocation()
            // Actual persistence + backend sync will be implemented in v1.
            lastCheckIn = now
            statusText = "已签到（正在获取位置…）"
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let loc = locations.last else { return }
        let lat = loc.coordinate.latitude
        let lng = loc.coordinate.longitude

        // For approx, blur coordinates client-side.
        let displayLat: Double
        let displayLng: Double
        if shareMode == .approx {
            displayLat = (lat * 100).rounded() / 100
            displayLng = (lng * 100).rounded() / 100
        } else {
            displayLat = lat
            displayLng = lng
        }

        statusText = "位置：\(displayLat), \(displayLng)"
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        statusText = "获取位置失败：\(error.localizedDescription)"
    }
}

struct CheckInView: View {
    @StateObject private var vm = CheckInViewModel()

    var body: some View {
        NavigationStack {
            Form {
                Section("签到") {
                    Picker("位置包含", selection: $vm.shareMode) {
                        ForEach(LocationShareMode.allCases, id: \.self) { mode in
                            Text(mode.displayName).tag(mode)
                        }
                    }

                    Button("现在签到") {
                        vm.requestLocationIfNeededAndCheckIn()
                    }

                    if let t = vm.lastCheckIn {
                        Text("最后签到：\(t.formatted())")
                    }

                    if !vm.statusText.isEmpty {
                        Text(vm.statusText)
                            .foregroundStyle(.secondary)
                    }
                }

                Section("说明") {
                    Text("连续 72 小时未签到后，系统将通过后端向你的紧急联系人发送双语邮件提醒。")
                }
            }
            .navigationTitle("签到")
        }
    }
}

#Preview {
    CheckInView()
}
